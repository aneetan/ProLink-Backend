import crypto from "crypto";
import axios from "axios";
import { esewaConfig } from "../../config/esewa.config";
import { EsewaSignedPayload, InitiateEsewaPaymentInput } from "../../types/esewa.type";
import prisma from "../../config/dbconfig";
import { esewaRepository } from "../../repository/esewa.repository";

class EsewaService {
  private sign(message: string): string {
    return crypto
      .createHmac("sha256", esewaConfig.secretKey)
      .update(message)
      .digest("base64");
  }

  async initiatePayment(input: InitiateEsewaPaymentInput) {
    const contract = await prisma.contract.findUnique({
      where: { id: input.contractId },
    });

    const amount = input.amount;
    if (!contract) throw new Error("Contract not found");

    const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const unsignedPayload = {
      amount: String(input.amount),
      tax_amount: "0",
      total_amount: String(input.amount),
      transaction_uuid: transactionId,
      product_code: esewaConfig.merchantCode,
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: esewaConfig.successUrl,
      failure_url: esewaConfig.failureUrl,
    };

    const signedFields = [
      "total_amount",
      "transaction_uuid",
      "product_code",
    ];

    const message = signedFields
      .map((f) => `${f}=${unsignedPayload[f as keyof typeof unsignedPayload]}`)
      .join(",");

    const payload: EsewaSignedPayload = {
      ...unsignedPayload,
      signed_field_names: signedFields.join(","),
      signature: this.sign(message),
    };

    await esewaRepository.createPayment({
      contractId: contract.id,
      clientId: input.clientId,
      companyId: contract.companyId,
      amount: input.amount,
      transactionId,
      gatewayPayload: payload,
    });

    return {
      paymentUrl: esewaConfig.paymentUrl,
      payload,
    };
  }

  async verifyPayment(transactionId: string, refId: string) {
    const payment = await esewaRepository.findByTransactionId(transactionId);
    if (!payment) throw new Error("Payment not found");

    if (payment.status === "SUCCESS") return true;

    const response = await axios.get(esewaConfig.verifyUrl, {
      params: {
        product_code: esewaConfig.merchantCode,
        transaction_uuid: transactionId,
        total_amount: payment.amount,
      },
    });

    await prisma.$transaction([
      esewaRepository.markSuccess(transactionId, refId, response.data),
      prisma.contract.update({
        where: { id: payment.contractId },
        data: {
          paymentStatus: "FULLY_PAID",
          status: "ACTIVE",
        },
      }),
    ]);

    return true;
  }
}

export const esewaService = new EsewaService();
