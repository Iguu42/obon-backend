import { Event, EventCreate, EventPreview, EventRepository, RecentEvents } from "../interfaces/event.interface";
import { User } from "../interfaces/user.interface";
import { UserRepositoryPrisma } from "../repositories/user.repository";

class EventUseCase {
    private eventRepository: EventRepository;
    private userRepository: UserRepositoryPrisma = new UserRepositoryPrisma()
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

    async getEventsByCategory(categoryId:string): Promise<EventPreview[]>{
        return await this.eventRepository.getEventsByCategory(categoryId);
    }

    async getEventById(id:string):Promise<any>{
        return await this.eventRepository.getEventById(id);
    }

    async getEventsByCreatorId(creatorId: string): Promise<EventPreview[]> {
        return await this.eventRepository.getEventsByCreatorId(creatorId);
    }

    async getRecentEvents(): Promise<RecentEvents[]> {
        return await this.eventRepository.getRecentEvents();
    }
}

export { EventUseCase };
