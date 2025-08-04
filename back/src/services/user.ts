import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, Queue } from "../models/index.js";
import type { RegisterInput, LoginInput } from "../schemas/index.js";

/**
 * User signup - creates a new user account
 * @param userData - User registration data
 * @returns Created user with token
 */
const Signup = async (userData: RegisterInput) => {
	const { email, password, businessName } = userData;

	const existingUser = await User.findOne({ email });
	if (existingUser) {
		throw new Error("User already exists");
	}

	const businessNameForUrl = businessName
		.toLowerCase()
		.replace(/\s+/g, "")
		.replace(/[^a-z0-9-]/g, "");

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	const user = new User({
		email,
		password: hashedPassword,
		businessName,
		businessNameForUrl,
		role: "user",
	});

	await user.save();

	const token = jwt.sign(
		{ userId: user._id, role: user.role },
		process.env.JWT_SECRET!,
	);

	return { token, role: user.role };
};

/**
 * User login - authenticates user credentials
 * @param credentials - User login credentials
 * @returns User token and role
 */
const Login = async (credentials: LoginInput) => {
	const { email, password } = credentials;

	const user = await User.findOne({ email });
	if (!user) {
		throw new Error("Invalid credentials");
	}

	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		throw new Error("Invalid credentials");
	}

	const token = jwt.sign(
		{ userId: user._id, role: user.role },
		process.env.JWT_SECRET!,
	);

	return { token, role: user.role };
};

/**
 * Get user profile by ID
 * @param userId - User ID
 * @returns User profile without password
 */
const GetMe = async (userId: string) => {
	const user = await User.findById(userId).select("-password");
	if (!user) {
		throw new Error("User not found");
	}
	return user;
};

/**
 * Get all users in the system (Admin only)
 * @returns Array of all users without password field
 */
const getAllUsers = async () => {
	const users = await User.find().select("-password");
	return users;
};

/**
 * Change user role (Admin only)
 * @param userId - User ID to update
 * @param role - New role to assign ('admin' or 'user')
 * @returns Updated user without password field
 */
const changeUserRole = async (userId: string, role: string) => {
	const user = await User.findByIdAndUpdate(
		userId,
		{ role },
		{ new: true },
	).select("-password");

	if (!user) {
		throw new Error("User not found");
	}

	return user;
};

/**
 * Get real-time queue status for a specific business
 * @param userId - Business owner's user ID
 * @returns Object with waiting and serving patient counts
 */
const getQueueStatus = async (userId: string) => {
	const waitingCount = await Queue.countDocuments({
		userId,
		status: "waiting",
	});

	const servingCount = await Queue.countDocuments({
		userId,
		status: "serving",
	});

	return {
		waitingCount,
		servingCount,
	};
};

/**
 * Get business name by user ID
 * @param userId - User ID of business owner
 * @returns User object with only businessName field
 */
const getBusinessName = async (userId: string) => {
	const user = await User.findById(userId).select("businessName");
	if (!user) {
		throw new Error("User not found");
	}
	return user;
};

/**
 * Find user by their URL-friendly business name
 * @param businessNameForUrl - URL-friendly business identifier
 * @returns Complete user object for the business
 */
const getUserByBusiness = async (businessNameForUrl: string) => {
	const user = await User.findOne({ businessNameForUrl });
	if (!user) {
		throw new Error("Business not found");
	}
	return user;
};

/**
 * Get patient statistics with automatic daily count reset
 * @param userId - User ID to get statistics for
 * @returns Object with total patients, daily patients, and last reset date
 */
const getPatientStats = async (userId: string) => {
	const user = await User.findById(userId);
	if (!user) {
		throw new Error("User not found");
	}

	await (user as any).resetDailyCountIfNeeded();

	return {
		totalPatients: user.totalPatients,
		dailyPatients: user.dailyPatients,
		lastResetDate: user.lastResetDate,
	};
};

/**
 * Update business operating hours with validation
 * @param userId - User ID of business owner
 * @param businessHoursData - Object containing startHour, startMinute, endHour, endMinute
 * @returns Success message with updated business hours
 */
const updateBusinessHours = async (userId: string, businessHoursData: any) => {
	const { startHour, startMinute, endHour, endMinute } = businessHoursData;

	if (
		startHour < 0 ||
		startHour > 23 ||
		endHour < 0 ||
		endHour > 23 ||
		startMinute < 0 ||
		startMinute > 59 ||
		endMinute < 0 ||
		endMinute > 59
	) {
		throw new Error(
			"Invalid time format. Hours should be 0-23 and minutes should be 0-59.",
		);
	}

	const startTime = startHour * 60 + startMinute;
	const endTime = endHour * 60 + endMinute;

	if (startTime >= endTime) {
		throw new Error("End time must be after start time.");
	}

	const user = await User.findByIdAndUpdate(
		userId,
		{
			"businessHours.startHour": startHour,
			"businessHours.startMinute": startMinute,
			"businessHours.endHour": endHour,
			"businessHours.endMinute": endMinute,
		},
		{ new: true },
	);

	if (!user) {
		throw new Error("User not found");
	}

	return {
		message: "Business hours updated successfully",
		businessHours: user.businessHours,
	};
};

/**
 * Update complete business hours object (including weekend settings)
 * @param userId - User ID of business owner
 * @param businessHours - Complete business hours object
 * @returns Success message with updated user object
 */
const updateBusinessHoursFull = async (userId: string, businessHours: any) => {
	const user = await User.findByIdAndUpdate(
		userId,
		{ businessHours },
		{ new: true },
	);

	if (!user) {
		throw new Error("User not found");
	}

	return { message: "Business hours updated successfully", user };
};

export const UserService = {
	Signup,
	Login,
	GetMe,
	getAllUsers,
	changeUserRole,
	getQueueStatus,
	getBusinessName,
	getUserByBusiness,
	getPatientStats,
	updateBusinessHours,
	updateBusinessHoursFull,
};
