-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('eSewa', 'Stripe');

-- CreateTable
CREATE TABLE "Project" (
    "projectId" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "completionDate" TEXT NOT NULL,
    "projectUrl" TEXT,
    "imageUrl" TEXT,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("projectId")
);

-- CreateTable
CREATE TABLE "Payment" (
    "paymentId" SERIAL NOT NULL,
    "type" "PaymentType" NOT NULL,
    "accountName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("paymentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_accountNumber_key" ON "Payment"("accountNumber");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
