import type { Request } from "express";

interface AuthenticatedRequest extends Request {
	user?: {
		userId: string;
		role: string;
	};
}

interface JWTPayload {
	userId: string;
	role: string;
}

export type { AuthenticatedRequest, JWTPayload };
