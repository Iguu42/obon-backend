import { prisma } from "../database/prisma-client";
import { PurchaseOrderAndTicketsCreate, PurchaseOrderRepository } from "../interfaces/purchaseOrder.interface";

class PurchaseOrderRepositoryPrisma implements PurchaseOrderRepository {

    async create(data: PurchaseOrderAndTicketsCreate): Promise<any> {
        try {
            const { userId, eventId, ticketTypes, status } = data;

            return await prisma.$transaction(async (prisma) => {
                let totalPrice = 0;
                const ticketCreationData: any[] = [];

                for (const ticketTypeData of ticketTypes) {
                    const { ticketTypeId, participantName, participantEmail } = ticketTypeData;

                    const ticketType = await prisma.ticketType.findUnique({
                        where: { id: ticketTypeId }
                    });

                    if (!ticketType || ticketType.quantity < 1) {
                        throw new Error(`Insufficient ticket quantity available for ${ticketType?.description}. Available: ${ticketType?.quantity}, Requested: 1`);
                    }

                    totalPrice += ticketType.price;

                    ticketCreationData.push({
                        ticketTypeId,
                        participantName,
                        participantEmail,
                        price: ticketType.price,
                        status,
                        purchaseDate: new Date(),
                    });

                    await prisma.ticketType.update({
                        where: { id: ticketTypeId },
                        data: { quantity: ticketType.quantity - 1 }
                    });
                }

                const purchaseOrder = await prisma.purchaseOrder.create({
                    data: {
                        userId,
                        eventId,
                        totalPrice,
                        quantityTickets: ticketTypes.length,
                        status
                    }
                });

                await prisma.ticket.createMany({
                    data: ticketCreationData.map(ticket => ({
                        ...ticket,
                        purchaseOrderId: purchaseOrder.id
                    }))
                });

                return purchaseOrder;
            });
        } catch (error) {
            throw new Error(`Error creating purchase order: ${error}`);
        }
    }
};

export { PurchaseOrderRepositoryPrisma };
