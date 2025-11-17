-- CreateEnum
CREATE TYPE "WorkType" AS ENUM ('REMOTE', 'ONSITE');

-- CreateEnum
CREATE TYPE "Urgency" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "Requirement" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "workType" "WorkType" NOT NULL,
    "minimumBudget" INTEGER NOT NULL,
    "maximumBudget" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "timeline" TEXT NOT NULL,
    "skills" TEXT[],
    "attachment" TEXT NOT NULL DEFAULT '',
    "urgency" "Urgency" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Requirement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Requirement" ADD CONSTRAINT "Requirement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
