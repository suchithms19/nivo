import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { z } from "zod";
import type { AuthenticatedRequest, JWTPayload } from "../interfaces/auth.js";

// Authentication middleware
function authenticateToken(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
): void {
	const authHeader = req.headers.authorization;
	const token = authHeader?.split(" ")[1];

	if (token == null) {
		res.sendStatus(401);
		return;
	}

	jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
		if (err) {
			res.sendStatus(403);
			return;
		}

		const payload = decoded as JWTPayload;
		req.user = {
			userId: payload.userId,
			role: payload.role,
		};

		next();
	});
}

// Admin role verification middleware
function isAdmin(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
): void {
	if (req.user && req.user.role === "admin") {
		next();
	} else {
		res.status(403).json({ message: "Admin access required" });
	}
}

// Validation middleware
const validate =
	<T>(schema: z.ZodSchema<T>) =>
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			await schema.parseAsync(req.body);
			next();
		} catch (error) {
			res.status(400).json({ error: (error as z.ZodError).errors });
		}
	};

export { authenticateToken, isAdmin, validate };
