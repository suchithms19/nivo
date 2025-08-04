import { Router } from "express";
import { UserController } from "../controllers/user.js";
import { RegisterSchema, LoginSchema } from "../schemas/index.js";
import { validate, authenticateToken, isAdmin } from "../middlewares/index.js";

const router = Router();

router.post("/signup", validate(RegisterSchema), UserController.signup);
router.post("/login", validate(LoginSchema), UserController.login);
router.get("/profile", authenticateToken, UserController.getProfile);
router.get("/all", authenticateToken, isAdmin, UserController.getAllUsers);
router.put(
	"/role/:userId",
	authenticateToken,
	isAdmin,
	UserController.changeUserRole,
);
router.get("/queue-status/:userId", UserController.getQueueStatus);
router.get("/businessName/:userId", UserController.getBusinessName);
router.get(
	"/get-user-by-business/:businessNameForUrl",
	UserController.getUserByBusiness,
);
router.get("/patient-stats", authenticateToken, UserController.getPatientStats);
router.put(
	"/business-hours",
	authenticateToken,
	UserController.updateBusinessHours,
);
router.put(
	"/update-business-hours",
	authenticateToken,
	UserController.updateBusinessHoursFull,
);

export { router as userRouter };
