import {
	PurchaseOrderAndTicketsCreate,
	PurchaseOrderRepository,
} from "../interfaces/purchaseOrder.interface";
import { TicketTypeRepository } from "../interfaces/ticketType.interface";
import { PurchaseOrderRepositoryPrisma } from "../repositories/purchaseOrder.repository";
import { TicketTypeRepositoryPrisma } from "../repositories/ticketType.repository";
import { EventRepository } from "../interfaces/event.interface";
import { EventRepositoryPrisma } from "../repositories/event.repository";

class PurchaseOrderUseCase {
	private purchaseOrderRepository: PurchaseOrderRepository;
	private ticketTypeRepository: TicketTypeRepository;
	private eventRepository: EventRepository;

	constructor() {
		this.purchaseOrderRepository = new PurchaseOrderRepositoryPrisma();
		this.ticketTypeRepository = new TicketTypeRepositoryPrisma();
		this.eventRepository = new EventRepositoryPrisma();
	}

	async create(data: PurchaseOrderAndTicketsCreate) {
		const purchaseOrders =
			await this.purchaseOrderRepository.findPurchaseOrdersByUserAndEventId(
				data.user.id,
				data.eventId
		);
		const ticketsQuantityPurchased = purchaseOrders.reduce(
			(acc, purchaseOrder) => {
				return acc + purchaseOrder.tickets.length;
			},
			0
		);
		const ticketTypeIds = Array.from(
			new Set(data.ticketTypes.map((ticketType) => ticketType.ticketTypeId))
		);

		//Validar se o eventId é válido
		const event = await this.eventRepository.getEventById(data.eventId);

		//Validar se há algum ticketTypeId inválido e mapear a quantidade solicitada na requisição.
		const ticketTypes = await Promise.all(
			ticketTypeIds.map(async (id) => {
			  const ticketType = await this.ticketTypeRepository.findTicketTypeById(id);
			  
			  return {
				...ticketType,
				requestedCount: data.ticketTypes.reduce((acc, currentTicket) => {
				  if (currentTicket.ticketTypeId === ticketType.id) {
					return acc + 1;
				  }
				  return acc;
				}, 0)
			  };
			})
		  );

		//Validar se o usuário já tem a quantidade máxima de tickets
		if (ticketsQuantityPurchased >= event.maxTicketsPerUser) {
			throw new Error(
				"User already reached the maximum quantity tickets in this event"
			);
		}

		//Validar se a compra vai superar a quantidade máxima de tickets do evento
		if (
			data.ticketTypes.length + ticketsQuantityPurchased >
			event.maxTicketsPerUser
		) {
			throw new Error(
				"Maximum quantity per user exceeded when purchasing tickets"
			);
		}


		//Validar se a quantidade requisitada pelo usuário está disponível
		ticketTypes.forEach((ticketType) => {
			if(ticketType.quantity < ticketType.requestedCount){
				throw new Error(`Insufficient ticket quantity available for ${ticketType?.description}. Available: ${ticketType?.quantity}, Requested: ${ticketType.requestedCount}`)
			}
		})

		return await this.purchaseOrderRepository.create(data)
	}
}

export { PurchaseOrderUseCase };
