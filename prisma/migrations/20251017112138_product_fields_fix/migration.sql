/*
  Warnings:

  - You are about to drop the column `categoty` on the `Product` table. All the data in the column will be lost.
  - You are about to alter the column `date` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - Added the required column `category` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Product` DROP COLUMN `categoty`,
    ADD COLUMN `category` VARCHAR(191) NOT NULL,
    MODIFY `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
