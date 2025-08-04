import { AppointmentService } from "../services/appointment.js";
import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../interfaces/index.js";

const getAvailableSlots = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const availableSlots = await AppointmentService.getAvailableSlots(
			req.params.userId!,
			req.params.date!,
		);
		res.json(availableSlots);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error fetching available slots";
		if (message === "User not found") {
			res.status(404).json({ message });
			return;
		}
		res
			.status(500)
			.json({ message: "Error fetching available slots", error: message });
	}
};

const bookAppointment = async (req: Request, res: Response): Promise<void> => {
	try {
		const result = await AppointmentService.bookAppointment(
			req.params.userId!,
			req.body,
		);
		res.status(201).json(result);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error booking appointment";
		if (
			message ===
			"This slot is no longer available. Please choose another time."
		) {
			res.status(400).json({ message });
			return;
		}
		res
			.status(500)
			.json({ message: "Error booking appointment", error: message });
	}
};

const getUserAppointments = async (
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> => {
	try {
		const appointments = await AppointmentService.getUserAppointments(
			req.user!.userId,
		);
		res.json(appointments);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error fetching appointments";
		res
			.status(500)
			.json({ message: "Error fetching appointments", error: message });
	}
};

const cancelAppointment = async (
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> => {
	try {
		const result = await AppointmentService.cancelAppointment(
			req.params.appointmentId!,
			req.user!.userId,
		);
		res.json(result);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error cancelling appointment";
		if (message === "Appointment not found") {
			res.status(404).json({ message });
			return;
		}
		res
			.status(500)
			.json({ message: "Error cancelling appointment", error: message });
	}
};

const getTodayBookings = async (
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> => {
	try {
		const bookings = await AppointmentService.getTodayBookings(
			req.user!.userId,
		);
		res.json(bookings);
	} catch (error) {
		const message =
			error instanceof Error
				? error.message
				: "Error fetching today's bookings";
		res.status(500).json({
			message: "Error fetching today's bookings",
			error: message,
		});
	}
};

const addBooking = async (
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> => {
	try {
		const result = await AppointmentService.addBooking(
			req.user!.userId,
			req.body,
		);
		res.status(201).json(result);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error booking appointment";
		if (
			message ===
			"This slot is no longer available. Please choose another time."
		) {
			res.status(400).json({ message });
			return;
		}
		res
			.status(500)
			.json({ message: "Error booking appointment", error: message });
	}
};

const cancelBooking = async (
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> => {
	try {
		const result = await AppointmentService.cancelBooking(
			req.params.appointmentId!,
			req.user!.userId,
		);
		res.json(result);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Error cancelling appointment";
		if (message === "Appointment not found or already cancelled") {
			res.status(404).json({ message });
			return;
		}
		res
			.status(500)
			.json({ message: "Error cancelling appointment", error: message });
	}
};

const moveToWaitlist = async (
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> => {
	try {
		const result = await AppointmentService.moveToWaitlist(
			req.params.appointmentId!,
			req.user!.userId,
		);
		res.status(201).json(result);
	} catch (error) {
		const message =
			error instanceof Error
				? error.message
				: "Error moving appointment to waitlist";
		if (message === "Appointment not found or not in scheduled status") {
			res.status(404).json({ message });
			return;
		}
		res.status(500).json({
			message: "Error moving appointment to waitlist",
			error: message,
		});
	}
};

export const AppointmentController = {
	getAvailableSlots,
	bookAppointment,
	getUserAppointments,
	cancelAppointment,
	getTodayBookings,
	addBooking,
	cancelBooking,
	moveToWaitlist,
};
