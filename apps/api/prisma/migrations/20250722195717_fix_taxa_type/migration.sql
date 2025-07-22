/*
  Warnings:

  - You are about to alter the column `taxa_comissao` on the `indicacoes` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Int`.

*/
-- AlterTable
ALTER TABLE `indicacoes` MODIFY `taxa_comissao` INTEGER NOT NULL;
