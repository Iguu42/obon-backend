import { Event, EventCreate, EventRepository } from "../interfaces/event.interface";

class EventUseCase {
    private eventRepository: EventRepository;

    constructor(eventRepository: EventRepository) {
        this.eventRepository = eventRepository;
    }

    async create(eventData: EventCreate): Promise<Event> {
        try {
            return await this.eventRepository.create(eventData);
        } catch (error: any) {
            console.error('Error in EventUseCase create:', error);
            throw new Error('Error creating event. Please check your data and try again.');
        }
    }
}

export { EventUseCase };
