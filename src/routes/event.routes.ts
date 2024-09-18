import { FastifyInstance } from "fastify";
import { EventRepositoryPrisma } from "../repositories/event.repository";
import { EventUseCase } from "../usecases/event.usecase";
import { EventCreate } from "../interfaces/event.interface";
import { jwtValidator } from "../middlewares/auth.middleware";
import { User } from "../interfaces/user.interface";

const eventRepository = new EventRepositoryPrisma();
const eventUseCase = new EventUseCase(eventRepository);

export async function eventRoutes(fastify: FastifyInstance) {
	fastify.post<{ Body: EventCreate, Params: { externalId: string } }>("/", {preHandler:[jwtValidator], handler:async (req, reply) => {
		const {
			title,
			description,
			capacity,
			addressId,
			categoryId,
			startDate,
			endDate,
			format,
			producerId,
			ageRating,
			additionalDetails,
			creatorId,
		} = req.body;
		const externalId = req.params.externalId
		try {
			const data = await eventUseCase.create({
				title,
				description,
				capacity,
				addressId,
				categoryId,
				startDate,
				endDate,
				format,
				producerId,
				ageRating,
				additionalDetails,
				creatorId,
			}, externalId);
			reply.code(201).send(data);
		} catch (error: any) {
			console.error("Error in event creation route:", error);
			reply
				.code(400)
				.send({ error: error.message || "Unable to create event" });
		}
	}});

	fastify.get<{ Params: { categoryId: string } }>("/category/:categoryId", {
		handler: async (req, reply) => {
			const { categoryId } = req.params;
			try {
				const data = await eventUseCase.getEventsByCategory(categoryId);
				reply.code(200).send(data);
			} catch (error) {
				reply.code(404).send(error);
			}
		},
	});

	fastify.get<{ Params: { id: string } }>("/:id", {
		handler: async (req, reply) => {
			const { id } = req.params;
			try {
				const data = await eventUseCase.getEventById(id);
				reply.code(200).send(data);
			} catch (error) {
				reply.code(404).send(error);
			}
		},
	});

	fastify.get<{ Params: { creatorId: string } }>("/created", {
		preHandler: [jwtValidator],
		handler: async (req, reply) => {
			const { id } = req.user as User;
			try {
				const data = await eventUseCase.getEventsByCreatorId(id);
				reply.code(200).send(data);
			} catch (error) {
				reply.code(404).send(error);
			}
		},
	});

	fastify.get("/recent", async (req, reply) => {
		try {
			const data = await eventUseCase.getRecentEvents();
			reply.code(200).send(data);
		} catch (error) {
			reply.code(404).send(error);
		}
	});
}
