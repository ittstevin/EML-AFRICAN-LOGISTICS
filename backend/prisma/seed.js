const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@haulsync.com' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@haulsync.com',
      password: hashedPassword,
      role: 'Admin'
    }
  });

  // Create operator
  const operatorPassword = await bcrypt.hash('operator123', 12);
  const operator = await prisma.user.upsert({
    where: { email: 'operator@haulsync.com' },
    update: {},
    create: {
      name: 'John Operator',
      email: 'operator@haulsync.com',
      password: operatorPassword,
      role: 'Operator'
    }
  });

  // Create driver
  const driverPassword = await bcrypt.hash('driver123', 12);
  const driver = await prisma.user.upsert({
    where: { email: 'driver@haulsync.com' },
    update: {},
    create: {
      name: 'Mike Driver',
      email: 'driver@haulsync.com',
      password: driverPassword,
      role: 'Driver'
    }
  });

  // Create owners
  const owner1 = await prisma.owner.create({
    data: {
      name: 'ABC Transport Ltd',
      contact: '+1234567890'
    }
  });

  const owner2 = await prisma.owner.create({
    data: {
      name: 'XYZ Logistics',
      contact: '+0987654321'
    }
  });

  // Create trucks
  const truck1 = await prisma.truck.upsert({
    where: { plateNumber: 'ABC-123' },
    update: {},
    create: {
      plateNumber: 'ABC-123',
      type: 'medium',
      capacity: 5000,
      status: 'Available',
      ownerId: owner1.id
    }
  });

  const truck2 = await prisma.truck.upsert({
    where: { plateNumber: 'XYZ-456' },
    update: {},
    create: {
      plateNumber: 'XYZ-456',
      type: 'large',
      capacity: 10000,
      status: 'Available',
      ownerId: owner2.id
    }
  });

  console.log('Database seeded successfully!');
  console.log('Admin login: admin@haulsync.com / admin123');
  console.log('Operator login: operator@haulsync.com / operator123');
  console.log('Driver login: driver@haulsync.com / driver123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });