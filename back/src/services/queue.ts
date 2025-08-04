import { Queue, Patient, User } from "../models/index.js";

/**
 * Add a new patient to the waitlist (authenticated user action)
 * @param userId - Business owner's user ID
 * @param patientData - Object containing patient information (name, phoneNumber, age)
 * @returns Success message with created patient and queue entry
 */
const addPatient = async (userId: string, patientData: any) => {
	const { name, phoneNumber, age } = patientData;

	const patient = new Patient({
		userId: userId,
		name,
		entryTime: new Date(),
		date: new Date(),
		phoneNumber,
		age,
	});
	await patient.save();

	const queueEntry = new Queue({
		userId: userId,
		patient: patient._id,
		status: "waiting",
	});
	await queueEntry.save();

	const user = await User.findById(userId);
	if (!user) {
		throw new Error("User not found");
	}
	await (user as any).resetDailyCountIfNeeded();

	user.totalPatients += 1;
	user.dailyPatients += 1;
	await user.save();

	return { message: "Patient added to waitlist", patient, queueEntry };
};

/**
 * Get current waitlist for a business (with admin override)
 * @param userId - Business owner's user ID
 * @param role - User role ('admin' sees all, others see only their queue)
 * @returns Array of waiting patients with populated patient details
 */
const getWaitlist = async (userId: string, role: string) => {
	const query: any = { status: "waiting" };
	if (role !== "admin") {
		query.userId = userId;
	}

	const waitlist = await Queue.find(query)
		.populate("patient")
		.sort("createdAt");
	return waitlist;
};

/**
 * Get currently serving patients for a business
 * @param userId - Business owner's user ID
 * @param role - User role ('admin' sees all, others see only their patients)
 * @returns Array of patients currently being served
 */
const getServing = async (userId: string, role: string) => {
	const query: any = { status: "serving" };
	if (role !== "admin") {
		query.userId = userId;
	}

	const servingList = await Queue.find(query)
		.populate("patient")
		.sort("updatedAt");
	return servingList;
};

/**
 * Move a patient from waiting to serving status
 * @param patientId - Patient ID to serve
 * @param userId - Business owner's user ID
 * @param role - User role for authorization
 * @returns Success message with updated queue entry
 */
const servePatient = async (
	patientId: string,
	userId: string,
	role: string,
) => {
	const query: any = {
		patient: patientId,
		status: "waiting",
	};
	if (role !== "admin") {
		query.userId = userId;
	}

	const queueEntry = await Queue.findOneAndUpdate(
		query,
		{ status: "serving", updatedAt: Date.now() },
		{ new: true },
	).populate("patient");

	if (!queueEntry) {
		throw new Error("Patient not found in waitlist");
	}

	await Patient.findByIdAndUpdate(queueEntry.patient._id, {
		postConsultation: new Date(),
	});

	return { message: "Patient moved to serving", queueEntry };
};

/**
 * Mark a patient consultation as completed
 * @param patientId - Patient ID to complete
 * @param userId - Business owner's user ID
 * @param role - User role for authorization
 * @returns Success message with completed queue entry and patient data
 */
const completePatient = async (
	patientId: string,
	userId: string,
	role: string,
) => {
	const query: any = {
		patient: patientId,
		status: "serving",
	};
	if (role !== "admin") {
		query.userId = userId;
	}

	const queueEntry = await Queue.findOneAndUpdate(
		query,
		{ status: "completed", updatedAt: Date.now() },
		{ new: true },
	).populate("patient");

	if (!queueEntry) {
		throw new Error("Patient not found in serving list");
	}

	const patient = await Patient.findByIdAndUpdate(
		queueEntry.patient._id,
		{ completionTime: new Date() },
		{ new: true },
	);

	return { message: "Patient consultation completed", queueEntry, patient };
};

/**
 * Get specific patient details by ID
 * @param patientId - Patient ID to retrieve
 * @param userId - Business owner's user ID
 * @param role - User role for authorization
 * @returns Patient object with all details
 */
const getPatient = async (patientId: string, userId: string, role: string) => {
	const query: any = { _id: patientId };
	if (role !== "admin") {
		query.userId = userId;
	}

	const patient = await Patient.findOne(query);
	if (!patient) {
		throw new Error("Patient not found");
	}
	return patient;
};

/**
 * Get all patients across all statuses for a business
 * @param userId - Business owner's user ID
 * @param role - User role ('admin' sees all, others see only their patients)
 * @returns Array of all queue entries with populated patient details
 */
const getAllPatients = async (userId: string, role: string) => {
	const query: any = {};
	if (role !== "admin") {
		query.userId = userId;
	}

	const servingList = await Queue.find(query)
		.populate("patient")
		.sort("updatedAt");
	return servingList;
};

/**
 * Add patient via public self-registration (customer-facing)
 * @param userId - Business owner's user ID
 * @param patientData - Patient information from public form
 * @returns Success message with patient ID and queue entry
 */
const addCustomerPatient = async (userId: string, patientData: any) => {
	const user = await User.findById(userId);
	if (!user) {
		throw new Error("Queue not found");
	}

	const { name, phoneNumber, age } = patientData;

	const patient = new Patient({
		userId,
		name,
		entryTime: new Date(),
		date: new Date(),
		phoneNumber,
		age,
		selfRegistered: true,
	});
	await patient.save();

	const queueEntry = new Queue({
		userId,
		patient: patient._id,
		status: "waiting",
	});
	await queueEntry.save();

	await (user as any).resetDailyCountIfNeeded();

	user.totalPatients += 1;
	user.dailyPatients += 1;
	await user.save();

	return {
		message: "Patient added to waitlist",
		patientId: patient._id,
		queueEntry,
	};
};

/**
 * Get public waitlist view (customer-facing, limited data)
 * @param userId - Business owner's user ID
 * @returns Array of waiting patients with only names visible
 */
const getPublicWaitlist = async (userId: string) => {
	const waitlist = await Queue.find({ userId, status: "waiting" })
		.populate("patient", "name")
		.sort("createdAt");

	return waitlist;
};

/**
 * Remove patient from waitlist (customer self-cancellation)
 * @param patientId - Patient ID to remove
 * @param userId - Business owner's user ID
 * @returns Success message with updated patient status
 */
const removePatient = async (patientId: string, userId: string) => {
	const queueEntry = await Queue.findOneAndUpdate(
		{ patient: patientId, userId: userId, status: "waiting" },
		{ status: "cancelled", updatedAt: Date.now() },
		{ new: true },
	);

	if (!queueEntry) {
		throw new Error("Patient not found in waitlist or unauthorized");
	}

	const patient = await Patient.findByIdAndUpdate(
		patientId,
		{ canceled: true, selfCanceled: true },
		{ new: true },
	);

	const user = await User.findById(userId);
	if (user) {
		user.canceledPatients += 1;
		await user.save();
	}

	return { message: "Patient marked as canceled", patient };
};

/**
 * Cancel patient from waitlist (business owner action)
 * @param patientId - Patient ID to cancel
 * @param userId - Business owner's user ID
 * @param role - User role for authorization
 * @returns Success message with canceled patient data
 */
const cancelPatient = async (
	patientId: string,
	userId: string,
	role: string,
) => {
	const query: any = {
		patient: patientId,
		status: "waiting",
	};

	if (role !== "admin") {
		query.userId = userId;
	}

	const queueEntry = await Queue.findOneAndUpdate(
		query,
		{ status: "cancelled", updatedAt: Date.now() },
		{ new: true },
	).populate("patient");

	if (!queueEntry) {
		throw new Error("Patient not found in waitlist or unauthorized");
	}

	const patient = await Patient.findByIdAndUpdate(
		queueEntry.patient._id,
		{ canceled: true },
		{ new: true },
	);

	const user = await User.findById(userId);
	if (user) {
		user.canceledPatients += 1;
		await user.save();
	}

	return { message: "Patient marked as canceled", patient };
};

export const QueueService = {
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
