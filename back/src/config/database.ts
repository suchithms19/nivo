import mongoose from "mongoose";

async function connectDatabase(): Promise<void> {
	try {
		await mongoose.connect(process.env.MONGO_URI!);
		console.log("Database connected successfully");
	} catch (error) {
		console.error("Database connection failed:", error);
		process.exit(1);
	}
}

export { connectDatabase };
