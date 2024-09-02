export interface TicketTypeQuantity {
    ticketTypeId: string;
    quantityTickets: number;
    participantName: string;
    participantEmail: string;
}

export interface PurchaseOrder {
    id: string;
    userId: string;
    eventId: string;
    totalPrice: number;
    quantityTickets: number;
    status: string;
}

export interface PurchaseOrderAndTicketsCreate {
    userId: string;
    eventId: string;
    ticketTypes: TicketTypeQuantity[]; 
    status: string;
}

export interface PurchaseOrderRepository {
    create(data: PurchaseOrderAndTicketsCreate): Promise<PurchaseOrder | undefined>;
}
