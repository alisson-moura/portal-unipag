-- AlterTable
ALTER TABLE `estabelecimentos_ceopag` ADD COLUMN `gestor_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `estabelecimentos_ceopag` ADD CONSTRAINT `estabelecimentos_ceopag_gestor_id_fkey` FOREIGN KEY (`gestor_id`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
