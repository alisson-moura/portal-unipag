import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o processo de seed...');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('Admin@1234', salt);
  await prisma.usuario.create({
    data: {
      email: 'admin@unipag.com.br',
      senha: hashedPassword,
      nome: 'Administrador',
      role: 'ADMINISTRADOR',
    },
  });

  console.log('Seed concluído com sucesso!');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Ocorreu um erro durante o seed:', e);
  process.exit(1);
});
