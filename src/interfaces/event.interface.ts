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

export interface EventById {
    id: string;
    title: string;
    description: string;
    capacity: number;
    status: string | null;
    startDate: Date;
    endDate: Date;
    salesStartDate: Date | null;
    showStartDate: Date  | null;
    format: string;
    ageRating: number;
    additionalDetails: string;
    Address: {
      city: string;
      complement: string | null;
      neighborhood: string;
      number: string;
      state: string;
      street: string;
      zipCode: string;
    };
    ticketTypes: {
      id: string;
      description: string;
      price: number;
      quantityAvailablePerUser: number;
      salesStartDate: Date  | null;
      salesEndDate: Date  | null;
      isActive: boolean;
    }[];
    assets: {
      id: string;
      url: string;
      type: string;
      description: string | null;
    }[];
    attractions: {
      id: string;
      name: string;
      description: string | null;
      imageUrl: string;
    }[];
    producers: {
      id: string;
      name: string;
      email: string;
      description: string | null;
      imageUrl: string;
    };
  }

export interface EventRepository {
    create(data: EventCreate): Promise<Event>;
    getEventsByCategory(categoryId:string):Promise<EventPreview[]>;
    getEventById(id:string):Promise<EventById>
    getEventsByCreatorId(creatorId: string): Promise<EventPreview[]>;
}
