import { Producer, ProducerCreate, ProducerRepository } from "../interfaces/producer.interface";
import { prisma } from "../database/prisma-client";

class ProducerRepositoryPrisma implements ProducerRepository {

    async createProducer(producerCreate: ProducerCreate): Promise<Producer> {
        try {
            const existingProducer = await prisma.producer.findFirst({
                where: { email: producerCreate.email },
            });

            if (existingProducer) {
                throw new Error("ProducerAlreadyExistsError");
            }

            return await prisma.producer.create({
                data: {
                    name: producerCreate.name,
                    email: producerCreate.email,
                    description: producerCreate.description,
                    imageUrl: producerCreate.imageUrl,
                },
            });
        } catch (error) {
            console.log(error);
            if (error instanceof Error && error.message === "ProducerAlreadyExistsError") {
                throw new Error("Producer already exists");
            }
            throw new Error("Database error");
        }
    }

    getAllProducers(): Promise<Producer[]> {
        try {
            return prisma.producer.findMany();
        }catch (error) {
            console.log(error);
            throw new Error("Database error");
        }
    }
}

export { ProducerRepositoryPrisma };