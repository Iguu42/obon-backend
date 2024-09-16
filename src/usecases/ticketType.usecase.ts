import { EventRepository } from "../interfaces/event.interface";
import {
	TicketType,
	TicketTypeCreate,
	TicketTypeRepository,
} from "../interfaces/ticketType.interface";
import { UserRepository } from "../interfaces/user.interface";
import { EventRepositoryPrisma } from "../repositories/event.repository";
import { TicketTypeRepositoryPrisma } from "../repositories/ticketType.repository";
import { UserRepositoryPrisma } from "../repositories/user.repository";

class TicketTypeUseCase {
	private ticketTypeRepository: TicketTypeRepository =
		new TicketTypeRepositoryPrisma();
	private eventRepository: EventRepository = new EventRepositoryPrisma();
	private userRepository:UserRepository = new UserRepositoryPrisma()
	constructor() {}

	async create(
		data: TicketTypeCreate,
		externalId: string
	): Promise<TicketType> {
		/* ------------------------- Validadores implementados abaixo -------------------------*/
		//Verificar se o evento existe
		//Verificar se o usuário existe
		//Verificar se o usuário que está adicionando tickets tem esse nível de permissão
		const event = await this.eventRepository.getEventToValidate(data.eventId);
		if(!event){
			throw new Error("Event not found")
		}

		const user = await this.userRepository.findUserByExternalId(externalId)
		if(!user){
			throw new Error("User not found")
		}

		if(user.id !== event.creatorId){
			throw new Error("operation denied")
		}


		return await this.ticketTypeRepository.create(data);
	}
}

export { TicketTypeUseCase };
