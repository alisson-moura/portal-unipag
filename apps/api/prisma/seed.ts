import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o processo de seed...');
  const adminUser = await prisma.usuario.findUnique({
    where: { email: 'admin@unipag.tech' },
  });

  if (!adminUser) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@1234', salt);

    await prisma.usuario.create({
      data: {
        email: 'admin@unipag.tech',
        senha: hashedPassword,
        nome: 'Administrador',
        role: 'ADMINISTRADOR',
      },
    });
    console.log('Usuário administrador criado com sucesso.');
  } else {
    console.log('Usuário administrador já existe.');
  }

  const taxaExistente = await prisma.taxaAdministrativa.findFirst();

  if (!taxaExistente) {
    await prisma.taxaAdministrativa.create({
      data: {},
    });
    console.log('Taxa administrativa padrão criada com sucesso.');
  } else {
    console.log('Taxa administrativa já existe.');
  }

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Ocorreu um erro durante o processo de seed:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
