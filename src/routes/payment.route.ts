import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import esewaController from "../controller/esewa.controller";

const paymentRouter = Router();

// Only protect initiation with auth; callbacks and redirect must be public so Esewa can reach them
paymentRouter.post("/esewa/initiate", authMiddleware, esewaController.initiate);
paymentRouter.get("/esewa/redirect/:transactionId", esewaController.redirect);
paymentRouter.post("/esewa/success", esewaController.success);
paymentRouter.post("/esewa/failure", esewaController.failure);

export default paymentRouter;