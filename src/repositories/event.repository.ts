import { prisma } from "../database/prisma-client";
import {
	Event,
	EventById,
	EventCreate,
	EventPreview,
	EventRepository,
} from "../interfaces/event.interface";
import { Prisma } from "@prisma/client";
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
					producerId: data.producerId,
				},
			});
		} catch (error) {
			if ((error as Prisma.PrismaClientKnownRequestError).code === "P2002") {
				throw new Error(
					"Duplicate entry. The event data conflicts with an existing record."
				);
			}
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new Error(
					"Validation error. Please check the data you are sending."
				);
			}
			throw new Error("An unexpected error occurred while creating the event.");
		}
	}

	async getEventsByCategory(categoryId: string): Promise<EventPreview[]> {
		try {
			return await prisma.event.findMany({
				where: {
					categoryId,
				},
				select: {
					id: true,
					title: true,
					description: true,
					addressId: true,
					startDate: true,
					endDate: true,
					format: true,
					assets: {
						select: {
							id: true,
							url: true,
							type: true,
							description: true,
						},
					},
					Address: true,
				},
			});
		} catch (error) {
			throw new Error("Unable to get events by category");
		}
	}

	async getEventById(id: string): Promise<EventById> {
		try {
			const event = await prisma.event.findUniqueOrThrow({
				where: {
					id,
				},
				include: {
					ticketTypes: {
						select: {
							id: true,
							description: true,
							price: true,
                            quantity:true,
							quantityAvailablePerUser: true,
							salesStartDate: true,
							salesEndDate: true,
							isActive: true,
						},
					},
					assets: {
						select: {
							id: true,
							url: true,
							type: true,
							description: true,
						},
					},
					attractions: {
						select: {
							id: true,
							name: true,
							description: true,
							imageUrl: true,
						},
					},
					producers: {
						select: {
							id: true,
							name: true,
							email: true,
							description: true,
							imageUrl: true,
						},
					},
					Address: {
						select: {
							city: true,
							complement: true,
							neighborhood: true,
							number: true,
							state: true,
							street: true,
							zipCode: true,
						},
					},
				},
			});

			// Caso a quantidade de tickets por usuário for menor do que o total disponível, vamos retornar apenas o disponível.
			const ticketTypesAvailable = event.ticketTypes.map(({quantity, ...ticket}) => {
				return {
					...ticket,
					quantityAvailablePerUser:
						ticket.quantityAvailablePerUser < quantity
							? ticket.quantityAvailablePerUser
							: quantity,
				};
			});

			// Retornamos o evento com os ticketTypes modificados
			return {
				...event,
				ticketTypes: ticketTypesAvailable,
			};
		} catch (error) {
			throw new Error("Unable to get event by id");
		}
	}

	async getEventsByCreatorId(creatorId: string): Promise<EventPreview[]> {
		try {
            return await prisma.event.findMany({
                where: {
                    creatorId
                },
                select: {
                    id: true,
                    title: true,
                    addressId: true,
                    startDate: true,
					description:true,
					endDate:true,
					format:true,
                    assets: {
                        select: {
                            id: true,
                            url: true,
                            type: true,
                            description: true
                        }
                    },
					Address:true
                }
            });
        } catch (error) {
            throw new Error('Unable to get events by creator id');
        }
	}
}

export { EventRepositoryPrisma };
