import { QueueService } from "../services/queue.js";
import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../interfaces/index.js";

const addPatient = async (
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> => {
	try {
		const result = await QueueService.addPatient(req.user!.userId, req.body);
		res.status(201).json(result);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error adding patient";
		res.status(500).json({ message: "Error adding patient", error: message });
	}
};

const getWaitlist = async (
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> => {
	try {
		const waitlist = await QueueService.getWaitlist(
			req.user!.userId,
			req.user!.role,
		);
		res.json(waitlist);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error fetching waitlist";
		res
			.status(500)
			.json({ message: "Error fetching waitlist", error: message });
	}
};

const getServing = async (
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> => {
	try {
		const servingList = await QueueService.getServing(
			req.user!.userId,
			req.user!.role,
		);
		res.json(servingList);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error fetching serving list";
		res
			.status(500)
			.json({ message: "Error fetching serving list", error: message });
	}
};

const servePatient = async (
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> => {
	try {
		const result = await QueueService.servePatient(
			req.params.id!,
			req.user!.userId,
			req.user!.role,
		);
		res.json(result);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error updating patient status";
		if (message === "Patient not found in waitlist") {
			res.status(404).json({ message });
			return;
		}
		res
			.status(500)
			.json({ message: "Error updating patient status", error: message });
	}
};

const completePatient = async (
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> => {
	try {
		const result = await QueueService.completePatient(
			req.params.id!,
			req.user!.userId,
			req.user!.role,
		);
		res.json(result);
	} catch (error) {
		const message =
			error instanceof Error
				? error.message
				: "Error completing patient consultation";
		if (message === "Patient not found in serving list") {
			res.status(404).json({ message });
			return;
		}
		res.status(500).json({
			message: "Error completing patient consultation",
			error: message,
		});
	}
};

const getPatient = async (
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> => {
	try {
		const patient = await QueueService.getPatient(
			req.params.id!,
			req.user!.userId,
			req.user!.role,
		);
		res.json(patient);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error fetching patient details";
		if (message === "Patient not found") {
			res.status(404).json({ message });
			return;
		}
		res
			.status(500)
			.json({ message: "Error fetching patient details", error: message });
	}
};

const getAllPatients = async (
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> => {
	try {
		const servingList = await QueueService.getAllPatients(
			req.user!.userId,
			req.user!.role,
		);
		res.json(servingList);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error fetching patient list";
		res
			.status(500)
			.json({ message: "Error fetching patient list", error: message });
	}
};

const addCustomerPatient = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const result = await QueueService.addCustomerPatient(
			req.params.userId!,
			req.body,
		);
		res.status(201).json(result);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error adding patient";
		if (message === "Queue not found") {
			res.status(404).json({ message });
			return;
		}
		res.status(500).json({ message: "Error adding patient", error: message });
	}
};

const getPublicWaitlist = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const waitlist = await QueueService.getPublicWaitlist(req.params.userId!);
		res.json(waitlist);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error fetching public waitlist";
		res
			.status(500)
			.json({ message: "Error fetching public waitlist", error: message });
	}
};

const removePatient = async (req: Request, res: Response): Promise<void> => {
	try {
		const result = await QueueService.removePatient(
			req.params.id!,
			req.params.userId!,
		);
		res.json(result);
	} catch (error) {
		const message =
			error instanceof Error
				? error.message
				: "Error removing patient from waitlist";
		if (message === "Patient not found in waitlist or unauthorized") {
			res.status(404).json({ message });
			return;
		}
		res.status(500).json({
			message: "Error removing patient from waitlist",
			error: message,
		});
	}
};

const cancelPatient = async (
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> => {
	try {
		const result = await QueueService.cancelPatient(
			req.params.id!,
			req.user!.userId,
			req.user!.role,
		);
		res.json(result);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error canceling patient";
		if (message === "Patient not found in waitlist or unauthorized") {
			res.status(404).json({ message });
			return;
		}
		res
			.status(500)
			.json({ message: "Error canceling patient", error: message });
	}
};

export const QueueController = {
	addPatient,
	getWaitlist,
	getServing,
	servePatient,
	completePatient,
	getPatient,
	getAllPatients,
	addCustomerPatient,
	getPublicWaitlist,
	removePatient,
	cancelPatient,
};
