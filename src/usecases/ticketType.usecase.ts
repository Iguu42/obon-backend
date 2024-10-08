import { EventRepository } from "../interfaces/event.interface";
import {
	TicketType,
	TicketTypeCreate,
	TicketTypeRepository,
} from "../interfaces/ticketType.interface";
import { User } from "../interfaces/user.interface";
import { EventRepositoryPrisma } from "../repositories/event.repository";
import { TicketTypeRepositoryPrisma } from "../repositories/ticketType.repository";

class TicketTypeUseCase {
	private ticketTypeRepository: TicketTypeRepository =
		new TicketTypeRepositoryPrisma();
	private eventRepository: EventRepository = new EventRepositoryPrisma();
	constructor() {}

	async create(
		data: TicketTypeCreate,
		user: User
	): Promise<TicketType> {
		const event = await this.eventRepository.getEventToValidate(data.eventId);
		if(!event){
			throw new Error("Event not found")
		}

		if(user.id !== event.creatorId){
			throw new Error("operation denied")
		}

		return await this.ticketTypeRepository.create(data);
	}
}

export { TicketTypeUseCase };
