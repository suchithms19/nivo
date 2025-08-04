import express from "express";
import cors from "cors";
import { connectDatabase } from "./src/config/index.js";
import { userRouter, queueRouter } from "./src/routes/index.js";

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/queue", queueRouter);

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
