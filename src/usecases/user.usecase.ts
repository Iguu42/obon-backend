import { User, UserCreate, UserRepository, UserUpdateByClerk } from "../interfaces/user.interface";
import { UserRepositoryPrisma } from "../repositories/user.repository";

class UserUseCase {
	private userRepository: UserRepository = new UserRepositoryPrisma();

	constructor() {}


    async findAllEventsByExternalId(externalId: string): Promise<any> {
        return await this.userRepository.findAllEventsByExternalId(externalId);
    }
    
    async create({ externalId, firstName, lastName, email }: UserCreate): Promise<User> {
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('Email already exists');
        }
        return this.userRepository.create({ externalId, firstName, lastName, email });
    };

    async deleteByClerk(externalId: string): Promise<void> {
        const user = await this.userRepository.findUserByExternalId(externalId);
        return await this.userRepository.delete(user.id);
    };

    async updateByClerk({ externalId, firstName, lastName, email }: UserUpdateByClerk): Promise<UserUpdateByClerk> {
        if (!externalId) {
            throw new Error('External ID is required');
        }
        const user = await this.userRepository.findUserByExternalId(externalId);
        return await this.userRepository.userUpdateByClerk({ id: user.id, firstName, lastName, email })

    }

    async findUserByExternalOrId(id: string): Promise<User | null> {
        const data = await this.userRepository.findUserByExternalOrId(id);
        if (!data) throw new Error('User not found')
        return data;
    }
}

export { UserUseCase };
