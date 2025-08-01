import express from "express";
import cors from "cors";
import { connectDatabase } from "./src/config/index.js";
import { userRouter } from "./src/routes/index.js";

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/user", userRouter);

// Start server
async function startServer(): Promise<void> {
	try {
		await connectDatabase();
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	} catch (error) {
		console.error(" Failed to start server:", error);
		process.exit(1);
	}
}

startServer();
