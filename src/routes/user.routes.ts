import { FastifyInstance } from "fastify";
import { jwtValidator } from "../middlewares/auth.middleware";
import { UserUseCase } from "../usecases/user.usecase";
import { User, UserUpdate } from "../interfaces/user.interface";

const userUseCase = new UserUseCase();

export async function userRoutes(fastify: FastifyInstance) {
	fastify.get("/events", {
		preHandler: [jwtValidator],
		handler: async (req, reply) => {
			try {
				const user = req.user as User
				const data = await userUseCase.findAllEventsByUserId(user.id);
				reply.code(200).send(data);
			} catch (error) {
				reply.code(404).send(error);
			}
		},
	});

	fastify.get("/", {
		preHandler: [jwtValidator],
		handler: async (req, reply) => {
			const user = req.user as User
			try {
				reply.code(200).send(user);
			} catch (error) {
				reply.code(404).send(error);
			}
		},
	});

	fastify.patch<{ Body: UserUpdate}>("/", {
		preHandler: [jwtValidator],
		handler: async (req, reply) => {
			const user = req.user as User
			const { role, cpf, phone } = req.body;
			try {
				const data = await userUseCase.update({
					id: user.id,
					role,
					cpf,
					phone,
				});
				reply.code(200).send(data);
			} catch (error) {
				reply.code(400).send(error);
			}
		},
	});
}
