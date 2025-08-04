import { Router } from "express";
import { QueueController } from "../controllers/queue.js";
import { authenticateToken } from "../middlewares/index.js";

const router = Router();

router.post("/patient", authenticateToken, QueueController.addPatient);
router.get("/waitlist", authenticateToken, QueueController.getWaitlist);
router.get("/serving", authenticateToken, QueueController.getServing);
router.put(
	"/patient/:id/serve",
	authenticateToken,
	QueueController.servePatient,
);
router.put(
	"/patient/:id/complete",
	authenticateToken,
	QueueController.completePatient,
);
router.get("/patient/:id", authenticateToken, QueueController.getPatient);
router.get("/allpatient", authenticateToken, QueueController.getAllPatients);
router.post("/customeradd/:userId", QueueController.addCustomerPatient);
router.get("/public-waitlist/:userId", QueueController.getPublicWaitlist);
router.delete("/patientremove/:id/:userId", QueueController.removePatient);
router.put(
	"/patient/:id/cancelled",
	authenticateToken,
	QueueController.cancelPatient,
);

export { router as queueRouter };
