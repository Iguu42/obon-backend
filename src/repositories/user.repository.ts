import { prisma } from "../database/prisma-client";
import { User, UserCreate, UserRepository } from "../interfaces/user.interface";

class UserRepositoryPrisma implements UserRepository {

    async createUser(userCreate: UserCreate): Promise<User> {
        try {
            const existingUser = await prisma.user.findFirst({
                where: { email: userCreate.email },
            });

            if (existingUser) {
                throw new Error("UserAlreadyExistsError");
            }

            return await prisma.user.create({
                data: {
                    externalId: userCreate.externalId,
                    firstName: userCreate.firstName,
                    lastName: userCreate.lastName,
                    email: userCreate.email,
                    phone: userCreate.phone,
                    cpf: userCreate.cpf,
                    role: userCreate.role,
                },
            });
        } catch (error) {
            console.log(error);
            if (error instanceof Error && error.message === "UserAlreadyExistsError") {
                throw new Error("User already exists");
            }
            throw new Error("Database error");
        }
    }

    getUser(): Promise<User[]> {
        try {
            return prisma.user.findMany();
        } catch (error) {
            console.log(error);
            throw new Error("Database error");
        }
    }
}

export { UserRepositoryPrisma };