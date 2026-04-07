import { Router } from "express";
import { getStudentDashboard } from "../controllers/dashboard.controller.js";
import  verifyJWT  from "../middlewares/auth.middleware.js";

const router = Router();

// GET /api/dashboard/student
router.get("/student", verifyJWT, getStudentDashboard);

export default router;
