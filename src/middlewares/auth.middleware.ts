import { createClerkClient } from "@clerk/fastify";
import { env } from "../env";
import { checkPermissions, Method } from "../constants/permissions";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { UserRepositoryPrisma } from "../repositories/user.repository";

export async function jwtValidator(req: any, reply: any) {
	try {
		const clerkClient = createClerkClient({
			secretKey: env.CLERK_API_KEY,
			publishableKey: env.CLERK_PUBLISHABLE_KEY,
		});

		const token = req.headers["authorization"];
		const jwtUri = env.JWT_PUBLIC_KEY!;

		const jwksClientInstance = jwksClient({
			jwksUri: jwtUri,
		});

		const getKey = (header: any, callback: any) => {
			jwksClientInstance.getSigningKey(header.kid, (err, key: any) => {
				if (err) {
					console.error("Error getting signing key:", err);
					callback(err);
				}
				const signingKey = key.getPublicKey();
				callback(null, signingKey);
			});
		};

		const decodedToken: any = await new Promise((resolve, reject) => {
			jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
				if (err) {
					reject(err);
				} else {
					resolve(decoded);
				}
			});
		});

		const externalId = decodedToken.sub;
		//Verificar validade do token - OK
		//Verificar existência do usuário clerk - OK
		//Verificar existência do usuário no banco de dados - OK
		//Verificar permissão do usuário para acessar a rota - OK
		//Armarzenar usuário na requisição para utilizar nas lógicas do USECASE - OK?

		const clerkUser = externalId
			? await clerkClient.users.getUser(externalId)
			: null;

		if (!clerkUser) {
			reply.code(401).send({ error: "Unauthorized" });
			return false;
		}

		const allowedRoles = checkPermissions(req.url, req.method);

		if (!allowedRoles) {
			reply.code(403).send({ error: "Forbidden: Operation denied" });
			return false;
		}

		/* Remover mock quando garantir que o usuário tem uma role - Definir se fica no publicMetadata, privateMetadata */
		if (!allowedRoles.includes("admin")) {
			reply.code(403).send({ error: "Forbidden" });
			return false;
		}

		const user = await new UserRepositoryPrisma().findUserByExternalId(
			externalId
		);

    req.params.externalId = externalId
		req.user = user;
	} catch (error: any) {
		console.error("JWT Verification Error:", error.message);
		throw new Error(error.message);
	}
}
