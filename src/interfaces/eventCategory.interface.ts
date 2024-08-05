export interface EventCategory {
    id: string;
    name: string;
    isActive: boolean;
}

export interface EventCategoryCreate {
    name: string;
    isActive: boolean;
}

export interface EventCategoryRepository {
    createEvent(eventCategoryCreate: EventCategoryCreate): Promise<EventCategory>;
    getAllCategories(): Promise<EventCategory[]>;
}