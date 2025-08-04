import { Appointment, Patient, User, Queue } from "../models/index.js";

const getAvailableSlots = async (userId: string, date: string) => {
	const selectedDate = new Date(date);

	const user = await User.findById(userId);
	if (!user) {
		throw new Error("User not found");
	}

	const istOffset = 5.5 * 60 * 60 * 1000;

	const startOfDay = new Date(selectedDate);
	startOfDay.setHours(0, 0, 0, 0);

	const endOfDay = new Date(selectedDate);
	endOfDay.setHours(23, 59, 59, 999);

	const { startHour, startMinute, endHour, endMinute } = user.businessHours!;

	const existingAppointments = await Appointment.find({
		userId,
		status: "scheduled",
		startTime: {
			$gte: startOfDay,
			$lt: endOfDay,
		},
	});

	const availableSlots = [];
	const currentDate = new Date(selectedDate);

	const startTimeInMinutes = startHour * 60 + startMinute;
	const endTimeInMinutes = endHour * 60 + endMinute;

	for (
		let timeInMinutes = startTimeInMinutes;
		timeInMinutes < endTimeInMinutes;
		timeInMinutes += 30
	) {
		const hour = Math.floor(timeInMinutes / 60);
		const minute = timeInMinutes % 60;

		const slotStart = new Date(currentDate);
		slotStart.setHours(hour, minute, 0, 0);

		const utcSlotStart = new Date(slotStart.getTime() - istOffset);

		const nowInIST = new Date(Date.now() + istOffset);
		if (
			selectedDate.toDateString() === nowInIST.toDateString() &&
			slotStart < nowInIST
		) {
			continue;
		}

		const utcSlotEnd = new Date(utcSlotStart.getTime() + 30 * 60000);

		const isBooked = existingAppointments.some((apt) => {
			const aptStart = new Date(apt.startTime);
			return aptStart.getTime() === utcSlotStart.getTime();
		});

		if (!isBooked) {
			availableSlots.push({
				startTime: utcSlotStart.toISOString(),
				endTime: utcSlotEnd.toISOString(),
			});
		}
	}

	return availableSlots;
};

const bookAppointment = async (userId: string, appointmentData: any) => {
	const { startTime, name, phoneNumber, age } = appointmentData;

	const appointmentStartTime = new Date(startTime);

	const existingAppointment = await Appointment.findOne({
		userId,
		status: "scheduled",
		startTime: appointmentStartTime,
	});

	if (existingAppointment) {
		throw new Error(
			"This slot is no longer available. Please choose another time.",
		);
	}

	const patient = new Patient({
		userId,
		name,
		phoneNumber,
		age,
		entryTime: appointmentStartTime,
		date: appointmentStartTime,
		selfRegistered: true,
	});
	await patient.save();

	const appointment = new Appointment({
		userId,
		patientId: patient._id,
		startTime: appointmentStartTime,
		endTime: new Date(appointmentStartTime.getTime() + 30 * 60000),
	});
	await appointment.save();

	const user = await User.findById(userId);
	if (!user) {
		throw new Error("User not found");
	}
	await (user as any).resetDailyCountIfNeeded();
	user.totalPatients += 1;
	user.dailyPatients += 1;
	await user.save();

	return {
		message: "Appointment booked successfully",
		appointment,
		patient,
	};
};

const getUserAppointments = async (userId: string) => {
	const appointments = await Appointment.find({ userId })
		.populate("patientId")
		.sort("startTime");
	return appointments;
};

const cancelAppointment = async (appointmentId: string, userId: string) => {
	const appointment = await Appointment.findOneAndUpdate(
		{
			_id: appointmentId,
			userId: userId,
		},
		{ status: "cancelled" },
		{ new: true },
	);

	if (!appointment) {
		throw new Error("Appointment not found");
	}

	return { message: "Appointment cancelled successfully", appointment };
};

const getTodayBookings = async (userId: string) => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);

	const bookings = await Appointment.find({
		userId: userId,
		status: "scheduled",
		startTime: {
			$gte: today,
			$lt: tomorrow,
		},
	}).populate("patientId");

	return bookings;
};

const addBooking = async (userId: string, bookingData: any) => {
	const { name, phoneNumber, age, startTime } = bookingData;

	const appointmentStartTime = new Date(startTime);

	const existingAppointment = await Appointment.findOne({
		userId,
		status: "scheduled",
		startTime: appointmentStartTime,
	});

	if (existingAppointment) {
		throw new Error(
			"This slot is no longer available. Please choose another time.",
		);
	}

	const patient = new Patient({
		userId,
		name,
		phoneNumber,
		age,
		entryTime: appointmentStartTime,
		date: appointmentStartTime,
	});
	await patient.save();

	const appointment = new Appointment({
		userId,
		patientId: patient._id,
		startTime: appointmentStartTime,
		endTime: new Date(appointmentStartTime.getTime() + 30 * 60000),
	});
	await appointment.save();

	const user = await User.findById(userId);
	if (!user) {
		throw new Error("User not found");
	}
	await (user as any).resetDailyCountIfNeeded();
	user.totalPatients += 1;
	user.dailyPatients += 1;
	await user.save();

	return {
		message: "Appointment booked successfully",
		appointment,
		patient,
	};
};

const cancelBooking = async (appointmentId: string, userId: string) => {
	const appointment = await Appointment.findOneAndUpdate(
		{
			_id: appointmentId,
			userId: userId,
			status: "scheduled",
		},
		{
			status: "cancelled",
			updatedAt: Date.now(),
		},
		{ new: true },
	).populate("patientId");

	if (!appointment) {
		throw new Error("Appointment not found or already cancelled");
	}

	await Patient.findByIdAndUpdate((appointment.patientId as any)._id, {
		canceled: true,
	});

	return { message: "Appointment cancelled successfully", appointment };
};

const moveToWaitlist = async (appointmentId: string, userId: string) => {
	const appointment = await Appointment.findOne({
		_id: appointmentId,
		userId: userId,
		status: "scheduled",
	}).populate("patientId");

	if (!appointment) {
		throw new Error("Appointment not found or not in scheduled status");
	}

	appointment.status = "completed";
	await appointment.save();

	const patient = await Patient.findByIdAndUpdate(
		(appointment.patientId as any)._id,
		{
			entryTime: new Date(),
			date: new Date(),
		},
		{ new: true },
	);

	const queueEntry = new Queue({
		userId: userId,
		patient: patient!._id,
		status: "waiting",
		timeWaited: 0,
		timeServed: 0,
		createdAt: new Date(),
		updatedAt: new Date(),
	});
	await queueEntry.save();

	return {
		message: "Patient added to waitlist",
		patient,
		queueEntry,
	};
};

export const AppointmentService = {
	getAvailableSlots,
	bookAppointment,
	getUserAppointments,
	cancelAppointment,
	getTodayBookings,
	addBooking,
	cancelBooking,
	moveToWaitlist,
};
