import { Address } from "./address.interface";

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

export interface EventPreview {
    id:string,
    title:string,
    description:string,
    addressId:string,
    startDate:Date,
    endDate:Date,
    format:string,
    assets:{
        id:string,
        url:string,
        type:string,
        description:string | null
    }[],
    Address:Address
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
    getEventsByCategory(categoryId:string):Promise<EventPreview[]>;
}
