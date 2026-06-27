const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.kullanici.update({
  where: { email: 'emelyilmaz412@gmail.com' },
  data: { rol: 'ADMIN' }
})
  .then(d => console.log('Admin yapıldı:', d.ad, d.rol))
  .finally(() => prisma.$disconnect());
