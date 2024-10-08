import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Criando alguns usuários
  const user1 = await prisma.user.create({
    data: {
      externalId: 'ext-123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '123456789',
      cpf: '11122233344',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      externalId: 'ext-456',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '987654321',
      cpf: '55566677788',
    },
  });

  // Criando um endereço
  const address = await prisma.address.create({
    data: {
      street: 'Rua A',
      number: '123',
      complement: 'Apto 1',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01010101',
    },
  });

  // Criando uma categoria de evento
  const category = await prisma.eventCategory.create({
    data: {
      name: 'Música',
    },
  });

  // Criando um produtor
  const producer = await prisma.producer.create({
    data: {
      name: 'Produtor Exemplo',
      email: 'producer@example.com',
      description: 'Produtor de eventos musicais.',
      imageUrl: 'https://example.com/producer.jpg',
    },
  });

  // Criando um evento
  const event = await prisma.event.create({
    data: {
      title: 'Festival de Música',
      description: 'Um grande festival de música.',
      capacity: 500,
      categoryId: category.id,
      status: 'Ativo',
      startDate: new Date('2024-12-01T19:00:00Z'),
      endDate: new Date('2024-12-01T23:00:00Z'),
      format: 'Presencial',
      maxTicketsPerUser: 4,
      ageRating: 18,
      additionalDetails: 'Trazer ingressos digitais.',
      creatorId: user2.id,  // Usuário organizador
      producerId: producer.id,
      addressId: address.id,
    },
  });

  // Criando tipos de ingressos para o evento
  const ticketType1 = await prisma.ticketType.create({
    data: {
      eventId: event.id,
      description: 'Ingresso Pista',
      price: 100.00,
      quantity: 200,
      isActive: true
    },
  });

  const ticketType2 = await prisma.ticketType.create({
    data: {
      eventId: event.id,
      description: 'Ingresso VIP',
      price: 300.00,
      quantity: 50,
      isActive: true
    },
  });

  // Criando uma ordem de compra e tickets para o usuário
  const purchaseOrder = await prisma.purchaseOrder.create({
    data: {
      userId: user1.id,
      eventId: event.id,
      totalPrice: 400.00,
      quantityTickets: 2,
      status: 'PAID',
      tickets: {
        create: [
          {
            ticketTypeId: ticketType1.id,
            participantName: 'John Doe',
            participantEmail: 'john.doe@example.com',
            price: 100.00,
            status: 'ACTIVE',
          },
          {
            ticketTypeId: ticketType2.id,
            participantName: 'John Doe',
            participantEmail: 'john.doe@example.com',
            price: 300.00,
            status: 'ACTIVE',
          },
        ],
      },
    },
  });

  // Criando uma atração para o evento
  const attraction = await prisma.attraction.create({
    data: {
      eventId: event.id,
      name: 'Banda Exemplo',
      imageUrl: 'https://example.com/band.jpg',
      description: 'Banda de rock que tocará no festival.',
    },
  });

  console.log({ user1, user2, event, ticketType1, ticketType2, purchaseOrder, attraction });
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
