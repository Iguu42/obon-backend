import { z } from "zod";
import { ProducerUseCase } from "../usecases/producer.usecase";
import { FastifyInstance } from "fastify";


const producerUseCase = new ProducerUseCase();

const createProducerSchema = z.object({
    name: z.string().min(1, { message: 'Producer name is required' }),
    email: z.string().email({ message: 'Invalid email' }),
    description: z.string().min(1, { message: 'Description is required' }),
    imageUrl: z.string().url({ message: 'Invalid URL' }),
});

export async function producerRoutes(fastify: FastifyInstance) {
    fastify.post<{ Body: { name: string, email: string, description: string, imageUrl: string } }>('/', async (req, reply) => {
        const { name, email, description, imageUrl } = req.body;

        try {
            createProducerSchema.parse(req.body);

            const data = await producerUseCase.createProducer({ name, email, description, imageUrl });
            reply.code(201).send(data);
        } catch (error) {
            if (error instanceof z.ZodError) {
                reply.code(400).send({ error: error.errors });
            } else if (error instanceof Error && error.message === "Producer already exists") {
                reply.code(400).send({ error: error.message });
            } else {
                reply.code(500).send({ error: 'Internal Server Error' });
            }
        }
    });

    fastify.get('/', async (req, reply) => {
        try {
            const producers = await producerUseCase.getAllProducers();
            reply.code(200).send(producers);
        } catch (error) {
            reply.code(500).send({ error: 'Internal Server Error' });
        }
    });
};