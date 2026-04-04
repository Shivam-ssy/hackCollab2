import { Router } from "express";
import verifyAuth from "../middlewares/auth.middleware.js";
import { loadUserPermissions, requirePermission } from "../middlewares/permission.middleware.js";
import {
  inviteUser,
  acceptInvite,
  rejectInvite
} from "../controllers/team.invite.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Team Invite
 *   description: Team invitation APIs
 */

/**
 * @swagger
 * /api/team/invite:
 *   post:
 *     summary: Invite user
 *     tags: [Team Invite]
 *     security:
 *       - bearerAuth: []
 */
router.post("/invite", verifyAuth, loadUserPermissions, requirePermission("team:invite"), inviteUser);

/**
 * @swagger
 * /api/team/invite/{teamId}/accept:
 *   post:
 *     summary: Accept invite
 *     tags: [Team Invite]
 *     security:
 *       - bearerAuth: []
 */
router.post("/:teamId/accept", verifyAuth, loadUserPermissions, requirePermission("team:join"), acceptInvite);

/**
 * @swagger
 * /api/team/invite/{teamId}/reject:
 *   post:
 *     summary: Reject invite
 *     tags: [Team Invite]
 *     security:
 *       - bearerAuth: []
 */
router.post("/:teamId/reject", verifyAuth, loadUserPermissions, requirePermission("team:join"), rejectInvite);

export default router;