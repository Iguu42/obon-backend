export interface UserRepository {
    findAllEventsByExternalId(externalId: string): any;
}
