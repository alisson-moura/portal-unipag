-- DropForeignKey
ALTER TABLE `indicacoes` DROP FOREIGN KEY `indicacoes_id_fkey`;

-- AddForeignKey
ALTER TABLE `indicacoes` ADD CONSTRAINT `indicacoes_estabelecimento_id_fkey` FOREIGN KEY (`estabelecimento_id`) REFERENCES `estabelecimentos_ceopag`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
