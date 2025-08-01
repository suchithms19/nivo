import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import type { RegisterInput, LoginInput } from "../schemas/index.js";

/**
 * User signup - creates a new user account
 * @param userData - User registration data
 * @returns Created user with token
 */
const Signup = async (userData: RegisterInput) => {
	const { email, password, businessName } = userData;

	// Check if user already exists
	const existingUser = await User.findOne({ email });
	if (existingUser) {
		throw new Error("User already exists");
	}

	// Create URL-friendly business name
	const businessNameForUrl = businessName
		.toLowerCase()
		.replace(/\s+/g, "") // Remove all spaces
		.replace(/[^a-z0-9-]/g, ""); // Remove special characters except hyphen

	// Hash password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	// Create new user
	const user = new User({
		email,
		password: hashedPassword,
		businessName,
		businessNameForUrl,
		role: "user", // Default role
	});

	await user.save();

	// Generate JWT token
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

	// Find user by email
	const user = await User.findOne({ email });
	if (!user) {
		throw new Error("Invalid credentials");
	}

	// Verify password
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		throw new Error("Invalid credentials");
	}

	// Generate JWT token
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

export const UserService = {
	Signup,
	Login,
	GetMe,
};
