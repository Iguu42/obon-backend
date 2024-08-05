import { Producer, ProducerCreate, ProducerRepository } from "../interfaces/producer.interface";
import { ProducerRepositoryPrisma } from "../repositories/producer.repository";


class ProducerUseCase {
    private producerRepository: ProducerRepository;

    constructor() {
        this.producerRepository = new ProducerRepositoryPrisma();
    };

    async createProducer(producerCreate: ProducerCreate): Promise<Producer> {
        return await this.producerRepository.createProducer(producerCreate);
    };

    async getAllProducers(): Promise<Producer[]> {
        return await this.producerRepository.getAllProducers();
    };
};

export { ProducerUseCase };