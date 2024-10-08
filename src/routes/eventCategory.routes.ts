import { FastifyInstance } from "fastify";
import { EventCategoryUseCase } from "../usecases/eventCategory.usecase";
import { z } from "zod";
import { jwtValidator } from "../middlewares/auth.middleware";

const eventCategoryUseCase = new EventCategoryUseCase();

const createEventCategorySchema = z.object({
    name: z.string().min(1, { message: 'Category name is required' }),
    isActive: z.boolean().default(true),
});

export async function eventCategoryRoutes(fastify: FastifyInstance) {
    fastify.post<{ Body: { name: string, isActive: boolean } }>('/', {preHandler:[jwtValidator], handler: async (req, reply) => {
        const { name, isActive } = req.body;

        try {
            createEventCategorySchema.parse(req.body);

            const data = await eventCategoryUseCase.createEventCategory({ name, isActive });
            reply.code(201).send(data);
        } catch (error) {
            if (error instanceof z.ZodError) {
                reply.code(400).send({ error: error.errors });
            } else if (error instanceof Error && error.message === "Category already exists") {
                reply.code(400).send({ error: error.message });
            } else {
                reply.code(500).send({ error: 'Internal Server Error' });
            }
        }
    }});

    fastify.get('/', async (req, reply) => {
        try {
            const categories = await eventCategoryUseCase.getAllCategories();
            reply.code(200).send(categories);
        } catch (error) {
            reply.code(500).send({ error: 'Internal Server Error' });
        }
    });
};
