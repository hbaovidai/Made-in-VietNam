const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mivn5.com' },
    update: {
      passwordHash,
      role: 'ADMIN',
      status: 'ACTIVE'
    },
    create: {
      email: 'admin@mivn5.com',
      passwordHash,
      fullName: 'Super Admin',
      role: 'ADMIN',
      status: 'ACTIVE'
    }
  });
  console.log('✅ Admin seed completed! Login with admin@mivn5.com / 123456');
}

main().catch(console.error).finally(() => prisma.$disconnect());
