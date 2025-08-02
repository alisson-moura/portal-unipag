-- CreateTable
CREATE TABLE `taxa_administrativa` (
    `id` VARCHAR(191) NOT NULL,
    `taxa` DECIMAL(10, 4) NOT NULL,
    `atualizado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
