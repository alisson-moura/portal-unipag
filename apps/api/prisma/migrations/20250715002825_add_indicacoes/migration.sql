-- CreateTable
CREATE TABLE `indicacoes` (
    `id` VARCHAR(191) NOT NULL,
    `taxa_comissao` DECIMAL(10, 2) NOT NULL,
    `usuario_id` VARCHAR(191) NOT NULL,
    `estabelecimento_id` VARCHAR(191) NOT NULL,
    `atribuido_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `indicacoes_estabelecimento_unique`(`estabelecimento_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `indicacoes` ADD CONSTRAINT `indicacoes_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `indicacoes` ADD CONSTRAINT `indicacoes_id_fkey` FOREIGN KEY (`id`) REFERENCES `estabelecimentos_ceopag`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
