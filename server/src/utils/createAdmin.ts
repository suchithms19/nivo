import bcrypt from "bcryptjs";
import { User } from "../models/index.js";
import { connectDatabase } from "../config/index.js";

const createAdminUser = async (): Promise<void> => {
	try {
		const adminEmail = "suchithadmin@example.com";
		const adminPassword = "your_password";

		const existingAdmin = await User.findOne({ email: adminEmail });
		if (existingAdmin) {
			console.log("Admin user already exists");
			return;
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(adminPassword, salt);

		const adminUser = new User({
			email: adminEmail,
			password: hashedPassword,
			role: "admin",
		});

		await adminUser.save();
		console.log("Admin user created successfully");
	} catch (error) {
		console.error("Error creating admin user:", error);
	}
};

const run = async (): Promise<void> => {
	try {
		await connectDatabase();
		await createAdminUser();
		process.exit(0);
	} catch (error) {
		console.error("Script failed:", error);
		process.exit(1);
	}
};

run();
