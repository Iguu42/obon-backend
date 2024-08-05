import { prisma } from "../database/prisma-client";
import { EventCategory, EventCategoryCreate, EventCategoryRepository } from "../interfaces/eventCategory.interface";

class EventCategoryRepositoryPrisma implements EventCategoryRepository {
    async createEvent(eventCategoryCreate: EventCategoryCreate): Promise<EventCategory> {
        try {
            const existingCategory = await prisma.eventCategory.findFirst({
                where: { name: eventCategoryCreate.name },
            });

            if (existingCategory) {
                throw new Error("CategoryAlreadyExistsError");
            }

            return await prisma.eventCategory.create({
                data: {
                    name: eventCategoryCreate.name,
                    isActive: eventCategoryCreate.isActive !== undefined ? eventCategoryCreate.isActive : true,
                },
            });
        } catch (error) {
            console.log(error);
            if (error instanceof Error && error.message === "CategoryAlreadyExistsError") {
                throw new Error("Category already exists");
            }
            throw new Error("Database error");
        }
    }
    
    async getAllCategories(): Promise<EventCategory[]> {
        try {
            return await prisma.eventCategory.findMany();
        } catch (error) {
            console.log(error);
            throw new Error("Database error");
        }
    }
}

export { EventCategoryRepositoryPrisma };
