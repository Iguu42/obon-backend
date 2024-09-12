import { prisma } from "../database/prisma-client";
import { Event, EventCreate, EventRepository } from "../interfaces/event.interface";
import { Prisma } from '@prisma/client';
class EventRepositoryPrisma implements EventRepository {
    async create(data: EventCreate): Promise<Event> {
        try {
            return await prisma.event.create({
                data: {
                    title: data.title,
                    description: data.description,
                    addressId: data.addressId,
                    capacity: data.capacity,
                    categoryId: data.categoryId,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    format: data.format,
                    ageRating: data.ageRating,
                    additionalDetails: data.additionalDetails,
                    creatorId: data.creatorId,
                    producerId: data.producerId
                }
            });
        } catch (error) {
            if ((error as Prisma.PrismaClientKnownRequestError).code === 'P2002') {
                throw new Error('Duplicate entry. The event data conflicts with an existing record.');
            }
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new Error('Validation error. Please check the data you are sending.');
            }
            throw new Error('An unexpected error occurred while creating the event.');
        }
    }
}

export { EventRepositoryPrisma };
