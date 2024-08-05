import { EventCategory, EventCategoryCreate, EventCategoryRepository } from "../interfaces/eventCategory.interface";
import { EventCategoryRepositoryPrisma } from "../repositories/eventCategory.repository";

class EventCategoryUseCase {
    private eventCategoryRepository: EventCategoryRepository;

    constructor() {
        this.eventCategoryRepository = new EventCategoryRepositoryPrisma();
    };

    async createEventCategory(eventCategoryCreate: EventCategoryCreate): Promise<EventCategory> {
        return await this.eventCategoryRepository.createEvent(eventCategoryCreate);
    };
    async getAllCategories(): Promise<EventCategory[]> {
      return await this.eventCategoryRepository.getAllCategories();
  };
};

export { EventCategoryUseCase };
