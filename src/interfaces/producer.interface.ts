export interface Producer {
    id: string;
    name: string;
    email: string;
    description: string | null;
    imageUrl: string | null;
}

export interface ProducerCreate {
    name: string;
    email: string;
    description: string | null;
    imageUrl: string;
}

export interface ProducerRepository {
    createProducer(producerCreate: ProducerCreate): Promise<Producer>;
    getAllProducers(): Promise<Producer[]>;
}