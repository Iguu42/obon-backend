export interface Event {
    id: string;
    title: string;
    description: string;
    capacity: number;
    categoryId: string;
    startDate: Date;
    endDate: Date;
    format: string;
    producerId: string;
    ageRating: number;
    additionalDetails: string;
    creatorId: string;
    addressId: string;
}

export interface EventCreate {
    title: string;
    description: string;
    capacity: number;
    categoryId: string;
    startDate: Date;
    endDate: Date;
    format: string;
    producerId: string;
    ageRating: number;
    additionalDetails: string;
    creatorId: string;
    addressId: string;
}

export interface EventRepository {
    create(data: EventCreate): Promise<Event>;
}
