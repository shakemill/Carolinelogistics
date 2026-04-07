/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `products` ADD COLUMN `seoDescription` TEXT NULL,
    ADD COLUMN `seoTitle` VARCHAR(191) NULL,
    ADD COLUMN `slug` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `settings` MODIFY `currency` VARCHAR(191) NULL DEFAULT 'EUR';

-- CreateIndex
CREATE UNIQUE INDEX `products_slug_key` ON `products`(`slug`);

-- CreateIndex
CREATE INDEX `products_slug_idx` ON `products`(`slug`);
