import { UserUseCase } from "../usecases/user.usecase";
import { FastifyInstance } from "fastify";
import { z } from "zod";

const userUseCase = new UserUseCase();

const createUserSchema = z.object({
    externalId: z.string().min(1, { message: 'External ID is required' }),
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    email: z.string().email({ message: 'Invalid email' }),
    phone: z.string().min(1, { message: 'Phone is required' }),
    cpf: z.string().min(1, { message: 'CPF is required' }),
    role: z.string().min(1, { message: 'Role is required' }),
});

export async function userRoutes(fastify: FastifyInstance) {
    fastify.post<{ Body: { externalId: string, firstName: string, lastName: string, email: string, phone: string, cpf: string, role: string } }>('/', async (req, reply) => {
        const { externalId, firstName, lastName, email, phone, cpf, role } = req.body;

        try {
            createUserSchema.parse(req.body);

            const data = await userUseCase.createUser({ externalId, firstName, lastName, email, phone, cpf, role });
            reply.code(201).send(data);
        } catch (error) {
            if (error instanceof z.ZodError) {
                reply.code(400).send({ error: error.errors });
            } else if (error instanceof Error && error.message === "User already exists") {
                reply.code(400).send({ error: error.message });
            } else {
                reply.code(500).send({ error: 'Internal Server Error' });
            }
        }
    });

    fastify.get('/', async (req, reply) => {
        try {
            const users = await userUseCase.getUser();
            reply.code(200).send(users);
        } catch (error) {
            reply.code(500).send({ error: 'Internal Server Error' });
        }
    });
}