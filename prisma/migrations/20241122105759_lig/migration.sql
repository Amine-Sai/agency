/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Service` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `price` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Service_title_key" ON "Service"("title");
