import { FastifyInstance } from "fastify";
import { EventRepositoryPrisma } from "../repositories/event.repository";
import { EventUseCase } from "../usecases/event.usecase";
import { EventCreate } from "../interfaces/event.interface";

const eventRepository = new EventRepositoryPrisma();
const eventUseCase = new EventUseCase(eventRepository);

export async function eventRoutes(fastify: FastifyInstance) {
    fastify.post<{ Body: EventCreate }>('/', async (req, reply) => {
        const { title, description, capacity, addressId, categoryId, startDate, endDate, format, producerId, ageRating, additionalDetails, creatorId } = req.body;

        try {
            const data = await eventUseCase.create({ 
                title, description, capacity, addressId, categoryId, startDate, endDate, format, producerId, ageRating, additionalDetails, creatorId 
            });
            reply.code(201).send(data);
        } catch (error: any) {
            console.error('Error in event creation route:', error);
            reply.code(400).send({ error: error.message || 'Unable to create event' });
        }
    });
}
