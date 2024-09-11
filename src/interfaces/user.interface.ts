export interface User {
    id: string;
    externalId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    cpf: string | null;
    role: string;
}
export interface UserCreate {
    externalId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    cpf: string;
    role: string;
}

export interface UserRepository {
    createUser(userCreate: UserCreate): Promise<User>;
    getUser(): Promise<User[]>;
}