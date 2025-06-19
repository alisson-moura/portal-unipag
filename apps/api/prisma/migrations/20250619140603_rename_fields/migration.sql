/*
  Warnings:

  - You are about to drop the column `vendedorId` on the `estabelecimentos` table. All the data in the column will be lost.
  - You are about to drop the column `dataContratacao` on the `vendedores` table. All the data in the column will be lost.
  - Added the required column `vendedor_id` to the `estabelecimentos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "estabelecimentos" DROP CONSTRAINT "estabelecimentos_vendedorId_fkey";

-- AlterTable
ALTER TABLE "estabelecimentos" DROP COLUMN "vendedorId",
ADD COLUMN     "vendedor_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "vendedores" DROP COLUMN "dataContratacao",
ADD COLUMN     "data_contratacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "estabelecimentos" ADD CONSTRAINT "estabelecimentos_vendedor_id_fkey" FOREIGN KEY ("vendedor_id") REFERENCES "vendedores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
