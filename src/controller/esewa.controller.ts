import { NextFunction, Request, Response } from "express";
import { esewaService } from "../services/payment/esewa.service";
import { esewaRepository } from "../repository/esewa.repository";
import { esewaConfig } from "../config/esewa.config";

class EsewaController {
   initiate = [
      async (req: Request, res: Response, next: NextFunction) => {
         try {
            const request = req as Request & { userId: string };
            const clientId = Number(request.userId);

            const { contractId, amount } = req.body;

            const result = await esewaService.initiatePayment({
               contractId,
               clientId,
               amount,
            });

            // provide a backend redirect URL which will POST the saved payload to Esewa
            const transactionId = (result.payload as any).transaction_uuid;
            const redirectUrl = `${process.env.BACKEND_URL || ""}/payment/esewa/redirect/${transactionId}`;

            res.json({ transactionId, redirectUrl, paymentUrl: result.paymentUrl, payload: result.payload });
         } catch(e) {
            console.log(e);
            res.status(500).json({ error: "Failed to initiate payment" });
         }
      }
   ]

   // Renders an auto-submitting POST form that forwards the saved payload to Esewa (avoids client doing GET to Esewa endpoint)
   redirect = async (req: Request, res: Response) => {
      const { transactionId } = req.params as { transactionId: string };

      const payment = await esewaRepository.findByTransactionId(transactionId);
      if (!payment) return res.status(404).send("Payment not found");

      const payload = payment.gatewayPayload || {};
      const action = esewaConfig.paymentUrl;

      const inputs = Object.entries(payload)
         .map(([k, v]) => `<input type="hidden" name="${k}" value="${String(v).replace(/"/g, '&quot;')}" />`)
         .join("\n");

      const html = `<!doctype html>
<html>
  <head><meta charset="utf-8"><title>Redirecting to Esewa</title></head>
  <body onload="document.forms[0].submit()">
    <form method="POST" action="${action}">
      ${inputs}
      <noscript>
        <p>JavaScript is required to continue to the payment gateway. Click the button below to continue.</p>
        <button type="submit">Continue to payment</button>
      </noscript>
    </form>
  </body>
</html>`;

      res.setHeader("Content-Type", "text/html");
      res.send(html);
   };

   success = [
      async (req: Request, res: Response, next: NextFunction) => {
         // Esewa may POST form data or redirect back with query params; accept both
         const transaction_uuid = (req.body && req.body.transaction_uuid) || (req.query && (req.query.transaction_uuid as string));
         const refId = (req.body && (req.body.refId || req.body.refid)) || (req.query && (req.query.refId || req.query.refid));

         if (!transaction_uuid) {
            return res.status(400).send("Missing transaction id");
         }

         const ok = await esewaService.verifyPayment(transaction_uuid as string, (refId as string) || "");

         res.redirect(
            ok
            ? `${process.env.FRONTEND_URL}/payment-success`
            : `${process.env.FRONTEND_URL}/payment-failed`
         );
      }
   ]

   failure = async (req: Request, res: Response) => {
      const transaction_uuid = (req.body && req.body.transaction_uuid) || (req.query && (req.query.transaction_uuid as string));
      if (transaction_uuid) await esewaRepository.markFailed(transaction_uuid as string);
      res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
   };
}

export default new EsewaController();