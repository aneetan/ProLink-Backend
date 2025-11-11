/*
  Warnings:

  - Added the required column `taxCertificate` to the `CompanyDocs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CompanyDocs" ADD COLUMN     "taxCertificate" TEXT NOT NULL,
ALTER COLUMN "logo" SET DATA TYPE TEXT,
ALTER COLUMN "businessLicense" SET DATA TYPE TEXT,
ALTER COLUMN "ownerId" SET DATA TYPE TEXT;
