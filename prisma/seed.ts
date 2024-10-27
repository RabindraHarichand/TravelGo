import { PrismaClient, Service } from '@prisma/client';

export const servicesToSeed: Service[] = [
  {
    id: 'ac4c1121-0520-4d29-be7e-d34ade7282ac',
    type: 'Hotel',
    name: 'The Ritz London',
    price: 500,
    description:
      'A luxurious 5-star hotel in London, offering exquisite dining, spa services, and prime city views.',
    status: 'Active',
  },
  {
    id: 'b644f1e8-7f9c-4915-a334-a4b4ea5328f9',
    type: 'Car service',
    name: 'Luxury Car Hire',
    price: 200,
    description:
      'Premium car rental service offering a range of luxury vehicles for hire.',
    status: 'Active',
  },
  {
    id: 'd674631c-529d-4ca7-9ffc-bbc623d354e8',
    type: 'Flight',
    name: 'British Airways',
    price: 300,
    description:
      'Direct flights from London to New York, with in-flight entertainment and meals.',
    status: 'Active',
  },
  {
    id: 'ec038286-cd2e-4ec8-8816-5be3e1bc485b',
    type: 'Tour',
    name: 'London Sightseeing Tour',
    price: 50,
    description:
      "A guided tour of London's top attractions, including the Tower of London, Buckingham Palace, and the London Eye.",
    status: 'Active',
  },
];

const prisma = new PrismaClient();

async function main() {
  for (const service of servicesToSeed) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: {},
      create: service,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
