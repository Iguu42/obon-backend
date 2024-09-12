export interface TicketTypeCreate {
	eventId: string;
	description: string;
	price: number;
	quantity: number;
	quantityAvailablePerUser: number;
	salesStartDate?: Date;
	salesEndDate?: Date;
	isActive?: boolean;
}

export interface TicketType {
	id: string;
	eventId: string;
	description: string;
	price: number;
	quantity: number;
	quantityAvailablePerUser: number;
	salesStartDate: Date | null;
	salesEndDate: Date | null;
	isActive: boolean;
}

export interface TicketTypeRepository {
	create(data: TicketTypeCreate): Promise<TicketType>;
}
