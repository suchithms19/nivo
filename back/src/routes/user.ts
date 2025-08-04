import { Router } from "express";
import { UserController } from "../controllers/user.js";
import { RegisterSchema, LoginSchema } from "../schemas/index.js";
import { validate, authenticateToken } from "../middlewares/index.js";

const router = Router();

/**
 * User routes
 * All business logic is handled in the controller layer
 */

router.post("/signup", validate(RegisterSchema), UserController.signup);
router.post("/login", validate(LoginSchema), UserController.login);
router.get("/profile", authenticateToken, UserController.getProfile);

export { router as userRouter };
