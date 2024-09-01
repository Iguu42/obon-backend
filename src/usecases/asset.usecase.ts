import { AssetCreate, AssetRepository } from "../interfaces/asset.interface";
import S3Storage from "../utils/s3.utils";
import { File } from "fastify-multer/lib/interfaces";
import { prisma } from "../database/prisma-client";

class UploadAssetUseCase {
    private assetRepository: AssetRepository;

    constructor(assetRepository: AssetRepository) {
        this.assetRepository = assetRepository;
    }

    async execute(file: File, assetData: AssetCreate): Promise<any> {
        if (!file.filename) {
            throw new Error('File name is undefined');
        }

        const event = await prisma.event.findUnique({
            where: { id: assetData.eventId },
        });

        if (!event) {
            throw new Error('Invalid eventId');
        }

        const s3Storage = new S3Storage();
        await s3Storage.saveFile(file.filename);

        const url = `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${file.filename}`;

        const assetCreateData: AssetCreate = {
            ...assetData,
            url: url,
        };

        return await this.assetRepository.createAsset(assetCreateData);
    }

    async delete(file: string): Promise<void> {
        const s3Storage = new S3Storage();
        await s3Storage.deleteFile(file);
    }
}

export { UploadAssetUseCase };
