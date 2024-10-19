import { prisma } from "../database/prisma-client";
import {
	PurchaseOrderAndTicketsCreate,
	PurchaseOrderInfo,
	PurchaseOrderRepository,
} from "../interfaces/purchaseOrder.interface";

class PurchaseOrderRepositoryPrisma implements PurchaseOrderRepository {
	async create(data: PurchaseOrderAndTicketsCreate): Promise<any> {
		try {
			const {user, eventId, ticketTypes, status } = data;

			return await prisma.$transaction(async (prisma) => {
				let totalPrice = 0;
				const ticketCreationData: any[] = [];

				for (const ticketTypeData of ticketTypes) {
					const { ticketTypeId, participantName, participantEmail } =
						ticketTypeData;

					const ticketType = await prisma.ticketType.findUniqueOrThrow({
						where: { id: ticketTypeId },
					});
					
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
						data: { quantity: ticketType.quantity - 1 },
					});
				}

				const purchaseOrder = await prisma.purchaseOrder.create({
					data: {
						userId: user.id,
						eventId,
						totalPrice,
						quantityTickets: ticketTypes.length,
						status,
					},
				});

				await prisma.ticket.createMany({
					data: ticketCreationData.map((ticket) => ({
						...ticket,
						purchaseOrderId: purchaseOrder.id,
					})),
				});

				return purchaseOrder;
			});
		} catch (error) {
			throw new Error(`Error creating purchase order: ${error}`);
		}
	}

	async findPurchaseOrdersByUserAndEventId(
		id: string,
		eventId: string
	): Promise<PurchaseOrderInfo[]> {
		try {
			const purchaseOrders = await prisma.purchaseOrder.findMany({
				where: { userId: id, eventId: eventId },
				select: {
					id: true,
					eventId: true,
					status: true,
					tickets: {
						select: {
							id: true,
							ticketTypeId: true,
							ticketType: {
								select: {
									description: true,
									isActive: true,
									price: true,
								},
							},
							participantName: true,
							participantEmail: true,
							price: true,
							status: true,
							purchaseDate: true,
							seatLocation: true,
						},
					},
                    event:{
                        select:{
                            maxTicketsPerUser:true
                        }
                    }
				},
			});

			return purchaseOrders;
		} catch (error) {
			console.error("Error finding events by external ID:", error);
			throw error;
		}
	}
}

export { PurchaseOrderRepositoryPrisma };
