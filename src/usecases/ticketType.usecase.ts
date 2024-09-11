import {
	TicketType,
	TicketTypeCreate,
	TicketTypeRepository,
} from "../interfaces/ticketType.interface";
import { TicketTypeRepositoryPrisma } from "../repositories/ticketType.repository";

class TicketTypeUseCase {
	private ticketTypeRepository: TicketTypeRepository =
		new TicketTypeRepositoryPrisma();
	constructor() {}

	async create(data: TicketTypeCreate, externalId:string): Promise<TicketType> {
        /* ------------------------- Validadores para implementar abaixo -------------------------*/

		//Primeiramente verificar se o evento existe apartir do EventId e armazenar numa constante

		/* Depois verificar se o owner do evento ou produtor é quem está criando o ticketType 
        (event.ownerId === user.id || event.producers.map(producer) => producer.id === user.id) 
        pegar valor de user apartir do token */

        /* ------------------------- Validadores para implementar acima -------------------------*/

		return await this.ticketTypeRepository.create(data);
	}
}

export { TicketTypeUseCase };
