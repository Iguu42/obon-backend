import { Event, EventCreate, EventPreview, EventRepository, RecentEvents } from "../interfaces/event.interface";
import { UserRepositoryPrisma } from "../repositories/user.repository";

class EventUseCase {
    private eventRepository: EventRepository;
    private userRepository: UserRepositoryPrisma = new UserRepositoryPrisma()
    constructor(eventRepository: EventRepository) {
        this.eventRepository = eventRepository;
    }

    async create(eventData: EventCreate, externalId:string): Promise<Event> {
        try {
            //Verifica se o usuário que fez a requisição existe
            //Verifica se o creatorId é igual o id do usuário que fez a requisição
            const user = await this.userRepository.findUserByExternalId(externalId)
            if(!user){
                throw new Error("user not found")
            }
            if(user.id !== eventData.creatorId){
                throw new Error("operation denied")
            }
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
