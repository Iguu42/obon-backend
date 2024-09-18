export type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type Role = "user" | "producer" | "admin";

type RoutePermissions = {
	[method in Method]?: Role[];
};

const permissions: Record<string, RoutePermissions> = {
	"/users": {
		GET: ["producer", "admin"],
		PATCH: ["user", "producer", "admin"]
	},
	"/users/events":{
		DELETE: ["admin"],
		GET: ["admin", "user"]
	}
};

export function checkPermissions(
	path: string,
	method: Method
): Role[] | undefined {
	if (!permissions[path]) {
		throw new Error("Path not found in permissions record, please verify");
	}
	if (!permissions[path][method]) {
		throw new Error("Method not allowed");
	}
	return permissions[path]?.[method];
}
