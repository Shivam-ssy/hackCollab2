import { Router } from "express";
import {
  getHackathonsForStudent,
  getParticipatedHackathons,
  getCollegeHackathons,
  createHackathon,
  updateHackathon,
  deleteHackathon,
  getJudgeHackathons,
  getSubmissionsForJudge,
  scoreSubmission,
  getHackathonBySlug,
} from "../controllers/hackathon.controller.js";
import verifyJWT  from "../middlewares/auth.middleware.js";
import { loadUserPermissions, requirePermission } from "../middlewares/permission.middleware.js";

const router = Router();

// Apply verifyJWT + loadUserPermissions globally to all hackathon routes
router.use(verifyJWT, loadUserPermissions);

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC-ISH  (any logged-in user)
// ─────────────────────────────────────────────────────────────────────────────

// All roles can view hackathon listings & detail
router.get("/", getHackathonsForStudent);
router.get("/:slug", getHackathonBySlug);

// ─────────────────────────────────────────────────────────────────────────────
// STUDENT  — permissions: team:create, team:join, team:leave, team:invite, team:submit
// ─────────────────────────────────────────────────────────────────────────────

// "team:join" is the closest proxy for "I am a participant" — guards student-only views
router.get(
  "/student/participated",
  requirePermission("team:join"),
  getParticipatedHackathons
);

// ─────────────────────────────────────────────────────────────────────────────
// COLLEGE  — permissions: hackathon:create, hackathon:update, hackathon:delete,
//                         judge:create, judge:assign, team:view
// ─────────────────────────────────────────────────────────────────────────────

router.get(
  "/college/my",
  requirePermission("hackathon:create"), // only colleges can create → they own this view
  getCollegeHackathons
);

router.post(
  "/",
  requirePermission("hackathon:create"),
  createHackathon
);

router.patch(
  "/:id",
  requirePermission("hackathon:update"),
  updateHackathon
);

router.delete(
  "/:id",
  requirePermission("hackathon:delete"),
  deleteHackathon
);

// ─────────────────────────────────────────────────────────────────────────────
// JUDGE  — permissions: team:view, team:score, team:review
// ─────────────────────────────────────────────────────────────────────────────

router.get(
  "/judge/assigned",
  requirePermission("team:review"),
  getJudgeHackathons
);

router.get(
  "/:id/submissions",
  requirePermission("team:review"),
  getSubmissionsForJudge
);

router.post(
  "/submissions/:submissionId/score",
  requirePermission("team:score"),
  scoreSubmission
);

export default router;