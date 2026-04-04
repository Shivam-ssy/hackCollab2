import { Router } from "express";
import verifyAuth from "../middlewares/auth.middleware.js";
import { loadUserPermissions, requirePermission } from "../middlewares/permission.middleware.js";
import {
  createTeam,
  getTeamById,
  getMyTeam,
  updateTeam,
  deleteTeam,
  leaveTeam,
  submitProject
} from "../controllers/team.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Team
 *   description: Team management APIs
 */

/**
 * @swagger
 * /api/team:
 *   post:
 *     summary: Create team
 *     tags: [Team]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/",
  verifyAuth,
  loadUserPermissions,
  requirePermission("team:create"),
  createTeam
);

/**
 * @swagger
 * /api/team/{id}:
 *   get:
 *     summary: Get team by ID
 *     tags: [Team]
 */
router.get("/:id", getTeamById);

/**
 * @swagger
 * /api/team/my/{hackathonId}:
 *   get:
 *     summary: Get my team
 *     tags: [Team]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/my/:hackathonId",
  verifyAuth,
  loadUserPermissions,
  requirePermission("team:view"),
  getMyTeam
);

/**
 * @swagger
 * /api/team/{id}:
 *   patch:
 *     summary: Update team
 *     tags: [Team]
 *     security:
 *       - bearerAuth: []
 */
router.patch(
  "/:id",
  verifyAuth,
  loadUserPermissions,
  requirePermission("team:update"),
  updateTeam
);

/**
 * @swagger
 * /api/team/{id}:
 *   delete:
 *     summary: Delete team
 *     tags: [Team]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/:id",
  verifyAuth,
  loadUserPermissions,
  requirePermission("team:delete"),
  deleteTeam
);
/**
 * @swagger
 * /api/team/{id}/leave:
 *   post:
 *     summary: Leave team
 *     tags: [Team]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/:id/leave",
  verifyAuth,
  loadUserPermissions,
  requirePermission("team:leave"),
  leaveTeam
);

/**
 * @swagger
 * /api/team/{teamId}/submit:
 *   post:
 *     summary: Submit project
 *     tags: [Team]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/:teamId/submit",
  verifyAuth,
  loadUserPermissions,
  requirePermission("team:submit"),
  submitProject
);
export default router;