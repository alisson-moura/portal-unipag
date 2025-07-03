-- CreateTable
CREATE TABLE `usuarios` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMINISTRADOR', 'VENDEDOR') NOT NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ativo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `usuarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estabelecimentos` (
    `estabelecimento_id` INTEGER NOT NULL,
    `vendedor_id` VARCHAR(191) NOT NULL,
    `taxa_comissao` INTEGER NOT NULL DEFAULT 20,
    `numero_documento` VARCHAR(191) NOT NULL,
    `razao_social` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `atribuido_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `estabelecimentos_estabelecimento_id_key`(`estabelecimento_id`),
    PRIMARY KEY (`estabelecimento_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `estabelecimentos` ADD CONSTRAINT `estabelecimentos_vendedor_id_fkey` FOREIGN KEY (`vendedor_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
