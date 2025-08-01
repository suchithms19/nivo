import type { Request } from "express";

// Extended Request interface with user data
interface AuthenticatedRequest extends Request {
	user?: {
		userId: string;
		role: string;
	};
}

// JWT payload type
interface JWTPayload {
	userId: string;
	role: string;
}

export type { AuthenticatedRequest, JWTPayload };
