import { User, UserCreate, UserRepository, UserUpdate, UserUpdateByClerk } from "../interfaces/user.interface";
import { UserRepositoryPrisma } from "../repositories/user.repository";

class UserUseCase {
    private userRepository: UserRepository = new UserRepositoryPrisma();

    constructor() { }


    async findAllEventsByUserId(id: string): Promise<any> {
        return await this.userRepository.findAllEventsByUserId(id);
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
        return await this.userRepository.findUserByExternalOrId(id);
    }

    async update({ id, role, cpf, phone }: UserUpdate): Promise<UserUpdate> {
        return await this.userRepository.userUpdate({ id, role, cpf, phone });
    }
}

export { UserUseCase };
