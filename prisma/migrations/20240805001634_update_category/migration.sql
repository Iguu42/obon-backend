/*
  Warnings:

  - You are about to drop the column `description` on the `eventCategories` table. All the data in the column will be lost.
  - Added the required column `name` to the `eventCategories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "eventCategories" DROP COLUMN "description",
ADD COLUMN     "name" TEXT NOT NULL;
