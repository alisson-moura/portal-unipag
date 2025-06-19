-- CreateTable
CREATE TABLE "vendedores" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dataContratacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estabelecimentos" (
    "id" INTEGER NOT NULL,
    "vendedorId" TEXT NOT NULL,

    CONSTRAINT "estabelecimentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vendedores_email_key" ON "vendedores"("email");

-- CreateIndex
CREATE UNIQUE INDEX "estabelecimentos_id_key" ON "estabelecimentos"("id");

-- AddForeignKey
ALTER TABLE "estabelecimentos" ADD CONSTRAINT "estabelecimentos_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "vendedores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
