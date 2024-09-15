export interface User {
    id: string;
    externalId: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

export interface UserCreate {
    externalId: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface UserUpdateByClerk {
    id?:string;
    externalId?: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface UserRepository {
    findAllEventsByExternalId(externalId: string): any;
    findUserByExternalId(externalId: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    create(data: UserCreate): Promise<User>;
    delete(id: string): Promise<void>;
    userUpdateByClerk(data: UserUpdateByClerk): Promise<UserUpdateByClerk>;
    findUserByExternalOrId(id: string): Promise<User | null>;
}
