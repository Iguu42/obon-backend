import { prisma } from "../database/prisma-client";
import { Asset, AssetCreate, AssetRepository } from "../interfaces/asset.interface";

class AssetRepositoryPrisma implements AssetRepository {
    async createAsset(data: AssetCreate): Promise<Asset> {
        try {
            return await prisma.asset.create({
                data: {
                    eventId: data.eventId,
                    type: data.type,
                    url: data.url,
                    description: data.description,
                },
            });
        } catch (error) {
            throw new Error('Unable to create asset');
        }
    }

    async deleteAsset(id: string): Promise<void> {
        try {
            await prisma.asset.delete({
                where: { id },
            });
        } catch (error) {
            throw new Error('Failed to delete asset');
        }
    }
}

export { AssetRepositoryPrisma };
