import { FastifyInstance } from "fastify";
import { jwtValidator } from "../middlewares/auth.middleware";
import { UserUseCase } from "../usecases/user.usecase";

const userUseCase = new UserUseCase();

export async function userRoutes(fastify: FastifyInstance) {
	fastify.get<{ Params: { externalId: string } }>("/events", {
		preHandler: [jwtValidator],
		handler: async (req, reply) => {
			const externalId = req.params.externalId;
			try {
				const data = await userUseCase.findAllEventsByExternalId(externalId);
				reply.code(200).send(data);
			} catch (error) {
				reply.code(404).send(error);
			}
		},
	});

	fastify.get<{ Params: { externalId: string } }>("/", {
		preHandler: [jwtValidator],
		handler: async (req, reply) => {
			const externalId = req.params.externalId;
			try {
				const data = await userUseCase.findUserByExternalOrId(externalId);
				reply.code(200).send(data);
			} catch (error) {
				reply.code(404).send(error);
			}
		},
	});
}
