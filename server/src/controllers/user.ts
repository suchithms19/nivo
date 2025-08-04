import { UserService } from "../services/user.js";
import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../interfaces/index.js";

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

const getAllUsers = async (
	_req: AuthenticatedRequest,
	res: Response,
): Promise<void> => {
	try {
		const users = await UserService.getAllUsers();
		res.json(users);
	} catch (_error) {
		res.status(500).json({ message: "Server error" });
	}
};

const changeUserRole = async (
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> => {
	try {
		const user = await UserService.changeUserRole(
			req.params.userId!,
			req.body.role,
		);
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

const getQueueStatus = async (req: Request, res: Response): Promise<void> => {
	try {
		const queueStatus = await UserService.getQueueStatus(req.params.userId!);
		res.json(queueStatus);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error fetching queue status";
		res
			.status(500)
			.json({ message: "Error fetching queue status", error: message });
	}
};

const getBusinessName = async (req: Request, res: Response): Promise<void> => {
	try {
		const user = await UserService.getBusinessName(req.params.userId!);
		res.json(user);
	} catch (error) {
		const message =
			error instanceof Error
				? error.message
				: "Error fetching user information";

		if (message === "User not found") {
			res.status(404).json({ message });
			return;
		}

		res.status(500).json({ message: "Error fetching user information" });
	}
};

const getUserByBusiness = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const user = await UserService.getUserByBusiness(
			req.params.businessNameForUrl!,
		);
		res.json(user);
	} catch (error) {
		const message = error instanceof Error ? error.message : "Server error";

		if (message === "Business not found") {
			res.status(404).json({ message });
			return;
		}

		res.status(500).json({ message: "Server error" });
	}
};

const getPatientStats = async (
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> => {
	try {
		const stats = await UserService.getPatientStats(req.user!.userId);
		res.json(stats);
	} catch (error) {
		const message =
			error instanceof Error
				? error.message
				: "Error fetching patient statistics";

		if (message === "User not found") {
			res.status(404).json({ message });
			return;
		}

		res.status(500).json({ message: "Error fetching patient statistics" });
	}
};

const updateBusinessHours = async (
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> => {
	try {
		const result = await UserService.updateBusinessHours(
			req.user!.userId,
			req.body,
		);
		res.json(result);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error updating business hours";

		if (
			message ===
			"Invalid time format. Hours should be 0-23 and minutes should be 0-59."
		) {
			res.status(400).json({ message });
			return;
		}

		if (message === "End time must be after start time.") {
			res.status(400).json({ message });
			return;
		}

		if (message === "User not found") {
			res.status(404).json({ message });
			return;
		}

		res
			.status(500)
			.json({ message: "Error updating business hours", error: message });
	}
};

const updateBusinessHoursFull = async (
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> => {
	try {
		const result = await UserService.updateBusinessHoursFull(
			req.user!.userId,
			req.body.businessHours,
		);
		res.json(result);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error updating business hours";

		if (message === "User not found") {
			res.status(404).json({ message });
			return;
		}

		res
			.status(500)
			.json({ message: "Error updating business hours", error: message });
	}
};

export const UserController = {
	signup,
	login,
	getProfile,
	getAllUsers,
	changeUserRole,
	getQueueStatus,
	getBusinessName,
	getUserByBusiness,
	getPatientStats,
	updateBusinessHours,
	updateBusinessHoursFull,
};
