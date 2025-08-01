import { UserService } from "../services/user.js";
import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../interfaces/index.js";

/**
 * Handle user registration
 * @route POST /signup
 * @param req - Express request object
 * @param res - Express response object
 */
const signup = async (req: Request, res: Response): Promise<void> => {
	try {
		const result = await UserService.Signup(req.body);
		res.json(result);
	} catch (error) {
		const message = error instanceof Error ? error.message : "Server error";

		if (message === "User already exists") {
			res.status(400).json({ message });
			return;
		}

		res.status(500).json({ message: "Server error" });
	}
};

/**
 * Handle user login
 * @route POST /login
 * @param req - Express request object
 * @param res - Express response object
 */
const login = async (req: Request, res: Response): Promise<void> => {
	try {
		const result = await UserService.Login(req.body);
		res.json(result);
	} catch (error) {
		const message = error instanceof Error ? error.message : "Server error";

		if (message === "Invalid credentials") {
			res.status(400).json({ message });
			return;
		}

		res.status(500).json({ message: "Server error" });
	}
};

/**
 * Get authenticated user profile
 * @route GET /profile
 * @param req - Express request object (AuthenticatedRequest)
 * @param res - Express response object
 */
const getProfile = async (
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> => {
	try {
		const user = await UserService.GetMe(req.user!.userId);
		res.json(user);
	} catch (error) {
		const message = error instanceof Error ? error.message : "Server error";

		if (message === "User not found") {
			res.status(404).json({ message });
			return;
		}

		res.status(500).json({ message: "Server error" });
	}
};

export const UserController = {
	signup,
	login,
	getProfile,
};
