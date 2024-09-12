import { Prisma } from "@prisma/client";
import { prisma } from "../database/prisma-client";
import { TicketType, TicketTypeCreate, TicketTypeRepository } from "../interfaces/ticketType.interface";

class TicketTypeRepositoryPrisma implements TicketTypeRepository {

  async create(data: TicketTypeCreate): Promise<TicketType> {
    try {
      return await prisma.ticketType.create({
        data: {
          eventId: data.eventId,
          description: data.description,
          price: data.price,
          quantity: data.quantity,
          quantityAvailablePerUser: data.quantityAvailablePerUser,
          salesStartDate: data.salesStartDate ?? null,
          salesEndDate: data.salesEndDate ?? null,
          isActive: data.isActive || true,
        },
      });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          // Handle known Prisma errors
          switch (error.code) {
            case "P2002":
              // Unique constraint violation
              throw new Error("A ticket type with the same unique field already exists.");
            case "P2003":
              // Foreign key constraint failure
              throw new Error("Invalid reference: the eventId does not exist.");
            default:
              throw new Error("A known error occurred with Prisma: " + error.message);
          }
        } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
          // Handle unknown errors
          throw new Error("An unknown error occurred while interacting with the database.");
        } else {
          // Generic error handling
          throw new Error("An error occurred when creating the ticket type.");
        }
      }
  }
}


export { TicketTypeRepositoryPrisma }
