import { Router } from "express";
import { AppointmentController } from "../controllers/appointment.js";
import { authenticateToken } from "../middlewares/index.js";

const router = Router();

router.get(
	"/available-slots/:userId/:date",
	AppointmentController.getAvailableSlots,
);
router.post("/book/:userId", AppointmentController.bookAppointment);
router.get(
	"/user-appointments",
	authenticateToken,
	AppointmentController.getUserAppointments,
);
router.put(
	"/cancel/:appointmentId",
	authenticateToken,
	AppointmentController.cancelAppointment,
);
router.get(
	"/today-bookings",
	authenticateToken,
	AppointmentController.getTodayBookings,
);
router.post(
	"/add-booking",
	authenticateToken,
	AppointmentController.addBooking,
);
router.put(
	"/cancel-booking/:appointmentId",
	authenticateToken,
	AppointmentController.cancelBooking,
);
router.post(
	"/move-to-waitlist/:appointmentId",
	authenticateToken,
	AppointmentController.moveToWaitlist,
);

export { router as appointmentRouter };
