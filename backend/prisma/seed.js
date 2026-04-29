const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean up existing users (except in production)
  if (process.env.NODE_ENV !== 'production') {
    await prisma.user.deleteMany({});
  }

  // Create admin user with provided credentials
  const hashedPassword = await bcrypt.hash('Tadmin@008', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'tevingichoya@gmail.com' },
    update: {},
    create: {
      name: 'System Administrator',
      email: 'tevingichoya@gmail.com',
      password: hashedPassword,
      role: 'admin'
    }
  });

  console.log('Database seeded successfully!');
  console.log('✓ Admin account created');
  console.log('Admin login: tevingichoya@gmail.com / Tadmin@008');
  console.log('\nYou can now create additional operator and driver accounts via the registration page.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });