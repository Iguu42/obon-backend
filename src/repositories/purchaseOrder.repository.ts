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
                    const { ticketTypeId, quantityTickets, participantName, participantEmail } = ticketTypeData;

                    const ticketType = await prisma.ticketType.findUnique({
                        where: { id: ticketTypeId }
                    });

                    if (!ticketType || ticketType.quantity < quantityTickets) {
                        throw new Error(`Insufficient ticket quantity available for ${ticketType?.description}. Available: ${ticketType?.quantity}, Requested: ${quantityTickets}`);
                    }

                    totalPrice += ticketType.price * quantityTickets;

                    ticketCreationData.push(
                        ...Array.from({ length: quantityTickets }).map(() => ({
                            ticketTypeId,
                            participantName,
                            participantEmail,
                            price: ticketType.price,
                            status,
                            purchaseDate: new Date(),
                        }))
                    );

                    await prisma.ticketType.update({
                        where: { id: ticketTypeId },
                        data: { quantity: ticketType.quantity - quantityTickets }
                    });
                }

                const purchaseOrder = await prisma.purchaseOrder.create({
                    data: {
                        userId,
                        eventId,
                        totalPrice,
                        quantityTickets: ticketTypes.reduce((acc, item) => acc + item.quantityTickets, 0),
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
            throw new Error(`${error}`);
        }
    }
}

export { PurchaseOrderRepositoryPrisma };
