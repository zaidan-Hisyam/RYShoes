import { PrismaClient } from '../src/generated/prisma';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await hash('adminpassword', 10);
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      password: password,
    },
    create: {
      username: 'admin',
      password: password,
      alamat_lengkap: 'Admin Address',
      role: 'ADMIN',
    },
  });
  console.log("Admin user upserted:", { admin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
