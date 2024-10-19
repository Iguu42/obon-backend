import { User } from "./user.interface";

export interface TicketTypeQuantity {
	ticketTypeId: string;
	participantName: string;
	participantEmail: string;
}

export interface PurchaseOrder {
	id: string;
	userId: string;
	eventId: string;
	totalPrice: number;
	status: string;
}

export interface PurchaseOrderAndTicketsCreate {
	eventId: string;
	ticketTypes: TicketTypeQuantity[];
	status: string;
	user: User;
}

interface TicketTypeInfo {
	description: string;
	isActive: boolean;
	price: number;
}

interface TicketInfo {
	id: string;
	ticketTypeId: string;
	ticketType: TicketTypeInfo;
	participantName: string;
	participantEmail: string;
	price: number;
	status: string;
	purchaseDate: Date | null;
	seatLocation: string | null;
}

export interface PurchaseOrderInfo {
	id: string;
	eventId: string;
	status: string;
	tickets: TicketInfo[];
    event:{
        maxTicketsPerUser:number
    };
}

export interface PurchaseOrderRepository {
	create(
		data: PurchaseOrderAndTicketsCreate
	): Promise<PurchaseOrder | undefined>;
	findPurchaseOrdersByUserAndEventId(
		id: string,
		eventId: string
	): Promise<PurchaseOrderInfo[]>;
}
