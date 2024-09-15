import { prisma } from "../database/prisma-client";
import { User, UserCreate, UserRepository } from "../interfaces/user.interface";

class UserRepositoryPrisma implements UserRepository {
	async create(data: UserCreate): Promise<User> {
		try {
			return await prisma.user.create({
				data: {
					externalId: data.externalId,
					firstName: data.firstName,
					lastName: data.lastName,
					email: data.email,
					role: "user",
				},
			});
		} catch (error) {
			throw new Error("Unable to create user");
		}
	}

	async delete(id: string): Promise<void> {
		try {
			await prisma.user.delete({
				where: {
					id,
				},
			});
		} catch (error) {
			throw new Error("Failed to delete user");
		}
	}

	async userUpdateByClerk(data: any): Promise<any> {
		try {
			const result = await prisma.user.update({
				where: {
					id: data.id,
				},
				data: {
					firstName: data.firstName,
					lastName: data.lastName,
					email: data.email,
				},
			});
			return result;
		} catch (error) {
			throw new Error("Failed to update user");
		}
	}

	async findAllEventsByExternalId(externalId: string): Promise<any> {
		try {
			return await prisma.$transaction(async (prisma) => {
				const user = await prisma.user.findFirstOrThrow({
					where: { externalId },
					select: { id: true },
				});

				const purchaseOrders = await prisma.purchaseOrder.findMany({
					where: { userId: user.id },
					select: {
						id: true,
						eventId: true,
						status: true,
						tickets: {
							select: {
								id: true,
								ticketTypeId: true,
								ticketType: {
									select: {
										description: true,
										isActive: true,
										price: true,
									},
								},
								participantName: true,
								participantEmail: true,
								price: true,
								status: true,
								purchaseDate: true,
								seatLocation: true,
							},
						},
					},
				});

				const events = await prisma.event.findMany({
					where: {
						id: {
							in: purchaseOrders.map((po) => po.eventId),
						},
					},
					select: {
						id: true,
						title: true,
						description: true,
						startDate: true,
						endDate: true,
						assets: {
							select: {
								id: true,
								url: true,
								type: true,
								description: true,
							},
						},
						Address: {
							select: {
								id: true,
								street: true,
								number: true,
								complement: true,
								neighborhood: true,
								city: true,
								state: true,
								zipCode: true,
							},
						},
					},
				});
				const result = events.map((event) => {
					const relatedPurchaseOrders = purchaseOrders.filter(
						(po) => po.eventId === event.id
					);
					return {
						...event,
						purchaseOrders: relatedPurchaseOrders,
					};
				});

				return result;
			});
		} catch (error) {
			console.error("Error finding events by external ID:", error);
			throw error;
		}
	}

	async findUserByExternalId(externalId: string): Promise<User> {
		try {
			return await prisma.user.findFirstOrThrow({
				where: {
					externalId,
				},
			});
		} catch (error) {
			throw new Error("Failed to find user by external id.");
		}
	}

	async findByEmail(email: string): Promise<User | null> {
		try {
			return await prisma.user.findFirst({
				where: {
					email,
				},
			});
		} catch (error) {
			throw new Error("Failed to find user by email");
		}
	}

	async findUserByExternalOrId(id: string): Promise<User | null> {
		try {
			return await prisma.user.findFirst({
				where: {
					OR: [
						{
							externalId: id,
						},
						{
							id: id,
						},
					],
				},
			});
		} catch (error) {
			throw new Error("Failed to find user by external id or id.");
		}
	}
}

export { UserRepositoryPrisma };
