import { Router } from "express";
import verifyAuth from "../middlewares/auth.middleware.js";
import { loadUserPermissions, requirePermission } from "../middlewares/permission.middleware.js";
import {
  joinTeam,
  acceptJoinRequest,
  removeMember
} from "../controllers/team.member.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Team Member
 *   description: Team member APIs
 */

/**
 * @swagger
 * /api/team/member/{teamId}/join:
 *   post:
 *     summary: Join team
 *     tags: [Team Member]
 *     security:
 *       - bearerAuth: []
 */
router.post("/:teamId/join", verifyAuth, loadUserPermissions, requirePermission("team:join"), joinTeam);

/**
 * @swagger
 * /api/team/member/{teamId}/{requesterId}/accept:
 *   post:
 *     summary: Accept join request
 *     tags: [Team Member]
 *     security:
 *       - bearerAuth: []
 */
router.post("/:teamId/:requesterId/accept", verifyAuth, loadUserPermissions, requirePermission("team:manage_members"), acceptJoinRequest);

/**
 * @swagger
 * /api/team/member/{teamId}/{memberId}:
 *   delete:
 *     summary: Remove member
 *     tags: [Team Member]
 *     security:
 *       - bearerAuth: []
 */
router.delete("/:teamId/:memberId", verifyAuth, loadUserPermissions, requirePermission("team:remove_member"), removeMember);

export default router;