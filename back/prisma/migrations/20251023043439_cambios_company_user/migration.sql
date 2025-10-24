-- DropForeignKey
ALTER TABLE "public"."Company" DROP CONSTRAINT "Company_planId_fkey";

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "planId" DROP NOT NULL,
ALTER COLUMN "availableMessages" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "phone" SET DATA TYPE BIGINT;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
