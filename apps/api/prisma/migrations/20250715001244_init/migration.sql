-- CreateTable
CREATE TABLE `usuarios` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NULL,
    `senha` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMINISTRADOR', 'VENDEDOR') NOT NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ativo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `usuarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estabelecimentos_ceopag` (
    `id` VARCHAR(191) NOT NULL,
    `ceo_pag_id` INTEGER NOT NULL,
    `document_number` VARCHAR(191) NOT NULL,
    `social_reason` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL,
    `account_source` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `estabelecimentos_ceopag_ceo_pag_id_account_source_key`(`ceo_pag_id`, `account_source`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
