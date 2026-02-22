import { PrismaClient, Role, Status } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const officerPassword = await bcrypt.hash('officer123', 10);

  // Clear existing data for a clean seed
  await prisma.complaint.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Admin
  await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@civic.com',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  // 2. Create 5 Officers for Wards 1-5
  const officersData = [
    { name: 'Officer Raman', email: 'officer1@civic.com', ward: 1 },
    { name: 'Officer Priya', email: 'officer2@civic.com', ward: 2 },
    { name: 'Officer Suresh', email: 'officer3@civic.com', ward: 3 },
    { name: 'Officer Anita', email: 'officer4@civic.com', ward: 4 },
    { name: 'Officer Vikram', email: 'officer5@civic.com', ward: 5 },
  ];

  const createdOfficers = [];
  for (const o of officersData) {
    const officer = await prisma.user.create({
      data: {
        name: o.name,
        email: o.email,
        password: officerPassword,
        role: Role.OFFICER,
        ward: o.ward,
      },
    });
    createdOfficers.push(officer);
  }

  console.log('Seed data created successfully with 1 Admin and 5 Officers (Zero Complaints)!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
