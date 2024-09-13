import { UserRepository } from "../interfaces/user.interface";
import { UserRepositoryPrisma } from "../repositories/user.repository";

class UserUseCase {
	private userRepository: UserRepository = new UserRepositoryPrisma();

	constructor() {}


    async findAllEventsByExternalId(externalId: string): Promise<any> {
        return await this.userRepository.findAllEventsByExternalId(externalId);
    }
    
}

export { UserUseCase };
