import { FastifyInstance } from "fastify";
import multer from "fastify-multer";
import multerLib from "../lib/multer.lib";
import { AssetRepositoryPrisma } from "../repositories/asset.repository";
import { UploadAssetUseCase } from "../usecases/asset.usecase";
import { AssetCreate } from "../interfaces/asset.interface";
import { jwtValidator } from "../middlewares/auth.middleware";

const assetRepository = new AssetRepositoryPrisma();
const uploadAssetUseCase = new UploadAssetUseCase(assetRepository);

export async function assetRoutes(fastify: FastifyInstance) {
	fastify.register(multer.contentParser);
	uploadAssetS3Route(fastify);
	deleteAssetS3Route(fastify);
}

function uploadAssetS3Route(fastify: FastifyInstance) {
	const upload = multer(multerLib);
	fastify.post<{
		Body: { eventId: string; type: string; description?: string };
	}>(
		"/upload",
		{ preHandler: [jwtValidator, upload.single("image")] },
		async (req, reply) => {
			const { file } = req as any;
			const { eventId, type, description } = req.body;

			try {
				if (!file) {
					return reply.code(400).send({ error: "File is missing" });
				}

				const assetData: AssetCreate = {
					eventId,
					type,
					url: "",
					description: description || null,
				};

				const data = await uploadAssetUseCase.execute(file, assetData);
				reply.code(201).send(data);
			} catch (error) {
				console.error(error);
				if (error instanceof Error) {
					if (error.message === "File name is undefined") {
						return reply.code(400).send({ error: "File name is undefined" });
					}
					if (error.message === "Invalid eventId") {
						return reply
							.code(400)
							.send({ error: "Invalid eventId. Event not found." });
					}
					if (error.message === "Unable to create asset") {
						return reply
							.code(500)
							.send({ error: "Unable to create asset in the database" });
					}
					if (error.message === "File not found") {
						return reply.code(400).send({ error: "File not found" });
					}
					return reply.code(500).send({ error: "Internal Server Error" });
				} else {
					return reply.code(500).send({ error: "Unknown error occurred" });
				}
			}
		}
	);
}

function deleteAssetS3Route(fastify: FastifyInstance) {
	fastify.delete<{ Params: { filename: string } }>("/upload/:filename", {
		preHandler: [jwtValidator],
		handler: async (req, reply) => {
			const { filename } = req.params;
			try {
				await uploadAssetUseCase.delete(filename);
				reply.code(204).send();
			} catch (error) {
				reply.code(404).send(error);
			}
		},
	});
}
