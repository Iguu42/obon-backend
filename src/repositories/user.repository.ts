import { prisma } from "../database/prisma-client";
import { UserRepository } from "../interfaces/user.interface";

class UserRepositoryPrisma implements UserRepository {
    async findAllEventsByExternalId(externalId: string): Promise<any> {
        try {
          return await prisma.$transaction(async (prisma) => {
            const user = await prisma.user.findFirstOrThrow({
              where: { externalId },
              select: { id: true },
            });
    
      
            const purchaseOrders = await prisma.purchaseOrder.findMany({
              where: { userId: user.id },
              select: {
                id: true,
                eventId: true,
                status: true,
                tickets: {
                  select: {
                    id: true,
                    ticketTypeId: true,
                    ticketType: {
                      select:{
                        description:true,
                        isActive:true,
                        price:true,               
                      }
                    },
                    participantName: true,
                    participantEmail: true,
                    price: true,
                    status: true,
                    purchaseDate: true,
                    seatLocation: true,
                  },
                },
              },
            });
      
            const events = await prisma.event.findMany({
              where: {
                id: {
                  in: purchaseOrders.map((po) => po.eventId),
                },
              },
              select:{
                id:true,
                title:true,
                description:true,
                startDate:true,
                endDate:true,
                assets:{
                    select: {
                        id: true,
                        url: true,
                        type: true,
                        description: true,
                      },
                },
                Address:{
                    select: {
                        id: true,
                        street: true,
                        number: true,
                        complement: true,
                        neighborhood: true,
                        city: true,
                        state: true,
                        zipCode: true,
                      },
                },
              }
            });
            const result = events.map(event => {
              const relatedPurchaseOrders = purchaseOrders.filter(po => po.eventId === event.id);
              return {
                ...event,
                purchaseOrders: relatedPurchaseOrders,
              };
            });
      
            return result;
          });
        } catch (error) {
          console.error("Error finding events by external ID:", error);
          throw error;
        }
      }

}

export { UserRepositoryPrisma };