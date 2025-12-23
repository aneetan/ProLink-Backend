import { PaymentType, StatusForPayment } from "@prisma/client";
import prisma from "../config/dbconfig";

class EsewaRepository {
  createPayment(data: {
    contractId: number;
    clientId: number;
    companyId: number;
    amount: number;
    transactionId: string;
    gatewayPayload: any;
  }) {
    return prisma.appPayment.create({
      data: {
        gateway: PaymentType.ESEWA,
        amount: data.amount,
        status: StatusForPayment.PENDING,
        transactionId: data.transactionId,
        gatewayPayload: data.gatewayPayload,
        contractId: data.contractId,
        clientId: data.clientId,
        companyId: data.companyId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  findByTransactionId(transactionId: string) {
    return prisma.appPayment.findFirst({
      where: { transactionId },
      include: { contract: true },
    });
  }

  markSuccess(transactionId: string, refId: string, payload: any) {
    return prisma.appPayment.updateMany({
      where: { transactionId },
      data: {
        status: StatusForPayment.SUCCESS,
        gatewayRefId: refId,
        gatewayPayload: payload,
        updatedAt: new Date(),
      },
    });
  }

  markFailed(transactionId: string) {
    return prisma.appPayment.updateMany({
      where: { transactionId },
      data: {
        status: StatusForPayment.FAILED,
        updatedAt: new Date(),
      },
    });
  }
}

export const esewaRepository = new EsewaRepository();
