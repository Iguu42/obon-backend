import { createClerkClient } from "@clerk/fastify";
import { env } from "../env";
import { checkPermissions, Method, Role } from "../constants/permissions";
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

		//Verify token validity
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

		//Verify if clerk user exists
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
		//Verify user permission to acess route
		const role = clerkUser.privateMetadata.role as Role
		if (!allowedRoles.includes(role)) {
			reply.code(403).send({ error: "Forbidden" });
			return false;
		}
		//Verify if user exists in database
		const user = await new UserRepositoryPrisma().findUserByExternalOrId(
			externalId
		);
		if(!user){
			throw new Error("User not found")
		}

		//Store user in request
    	req.params.externalId = externalId;
		req.user = user;
	} catch (error: any) {
		console.error("JWT Verification Error:", error.message);
		throw new Error(error.message);
	}
}
