import { User, UserCreate, UserRepository } from "../interfaces/user.interface";
import { UserRepositoryPrisma } from "../repositories/user.repository";

class UserUseCase {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepositoryPrisma();
    };

    async createUser(userCreate: UserCreate): Promise<User> {
        return await this.userRepository.createUser(userCreate);
    };

    async getUser(): Promise<User[]> {
        return await this.userRepository.getUser();
    };
};

export { UserUseCase };