import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { TicketTypeCreate } from "../interfaces/ticketType.interface";
import { TicketTypeUseCase } from "../usecases/ticketType.usecase";
import { jwtValidator } from "../middlewares/auth.middleware";

const ticketTypeUseCase = new TicketTypeUseCase();

export async function ticketTypeRoutes(fastify: FastifyInstance) {
	postTicketType(fastify);
}

function postTicketType(fastify: FastifyInstance) {
	fastify.post("/", {
		preHandler: [
			jwtValidator
		],
		handler: async (
			req: FastifyRequest<{
				Body: TicketTypeCreate;
				Params: { externalId: string };
			}>,
			reply: FastifyReply
		) => {
			const externalId = req.params.externalId;
			try {
				const data = await ticketTypeUseCase.create(
					req.body,
					externalId
				);
				reply.code(201).send(data);
			} catch (error) {
				reply.code(400).send(error);
			}
		},
	});
}
