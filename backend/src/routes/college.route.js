import { Router } from "express";
import verifyAuth from "../middlewares/auth.middleware.js";
import { loadUserPermissions, requirePermission } from "../middlewares/permission.middleware.js";
import {
  updateProfile,
  updateProfilePicture,
  getVolunteers,
  inviteVolunteer,
  removeVolunteer,
  createHackathon,
  getMyHackathons,
  getHackathonById,
  updateHackathon,
  updateHackathonStatus,
  deleteHackathon,
  getCollegeLandingPage,
  getHackathonBySlug
} from "../controllers/college.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: College
 *   description: College management APIs
 */

/**
 * @swagger
 * /api/college/profile:
 *   patch:
 *     summary: Update college profile
 *     tags: [College]
 *     security:
 *       - bearerAuth: []
 */
router.patch("/profile", verifyAuth, loadUserPermissions, requirePermission("college:update"), updateProfile);

/**
 * @swagger
 * /api/college/profile/picture:
 *   patch:
 *     summary: Update profile picture
 *     tags: [College]
 *     security:
 *       - bearerAuth: []
 */
router.patch("/profile/picture", verifyAuth, loadUserPermissions, requirePermission("college:update"), updateProfilePicture);

/**
 * @swagger
 * /api/college/volunteers:
 *   get:
 *     summary: Get volunteers
 *     tags: [College]
 *     security:
 *       - bearerAuth: []
 */
router.get("/volunteers", verifyAuth, loadUserPermissions, requirePermission("volunteer:view"), getVolunteers);

/**
 * @swagger
 * /api/college/volunteers/invite:
 *   post:
 *     summary: Invite volunteer
 *     tags: [College]
 *     security:
 *       - bearerAuth: []
 */
router.post("/volunteers/invite", verifyAuth, loadUserPermissions, requirePermission("volunteer:invite"), inviteVolunteer);

/**
 * @swagger
 * /api/college/volunteers/{volunteerId}:
 *   delete:
 *     summary: Remove volunteer
 *     tags: [College]
 *     security:
 *       - bearerAuth: []
 */
router.delete("/volunteers/:volunteerId", verifyAuth, loadUserPermissions, requirePermission("volunteer:remove"), removeVolunteer);

/**
 * @swagger
 * /api/college/hackathons:
 *   post:
 *     summary: Create hackathon
 *     tags: [College]
 *     security:
 *       - bearerAuth: []
 */
router.post("/hackathons", verifyAuth, loadUserPermissions, requirePermission("hackathon:create"), createHackathon);

/**
 * @swagger
 * /api/college/hackathons:
 *   get:
 *     summary: Get my hackathons
 *     tags: [College]
 *     security:
 *       - bearerAuth: []
 */
router.get("/hackathons", verifyAuth, loadUserPermissions, requirePermission("hackathon:view_own"), getMyHackathons);

/**
 * @swagger
 * /api/college/hackathons/{hackathonId}:
 *   get:
 *     summary: Get hackathon by ID
 *     tags: [College]
 *     security:
 *       - bearerAuth: []
 */
router.get("/hackathons/:hackathonId", verifyAuth, loadUserPermissions, requirePermission("hackathon:view"), getHackathonById);

/**
 * @swagger
 * /api/college/hackathons/{hackathonId}:
 *   patch:
 *     summary: Update hackathon
 *     tags: [College]
 *     security:
 *       - bearerAuth: []
 */
router.patch("/hackathons/:hackathonId", verifyAuth, loadUserPermissions, requirePermission("hackathon:update"), updateHackathon);

/**
 * @swagger
 * /api/college/hackathons/{hackathonId}/status:
 *   patch:
 *     summary: Update hackathon status
 *     tags: [College]
 *     security:
 *       - bearerAuth: []
 */
router.patch("/hackathons/:hackathonId/status", verifyAuth, loadUserPermissions, requirePermission("hackathon:publish"), updateHackathonStatus);

/**
 * @swagger
 * /api/college/hackathons/{hackathonId}:
 *   delete:
 *     summary: Delete hackathon
 *     tags: [College]
 *     security:
 *       - bearerAuth: []
 */
router.delete("/hackathons/:hackathonId", verifyAuth, loadUserPermissions, requirePermission("hackathon:delete"), deleteHackathon);

/**
 * @swagger
 * /api/college/landing/{collegeSlug}:
 *   get:
 *     summary: Public landing page
 *     tags: [College]
 */
router.get("/landing/:collegeSlug", getCollegeLandingPage);

/**
 * @swagger
 * /api/college/{collegeSlug}/{hackathonSlug}:
 *   get:
 *     summary: Get hackathon by slug
 *     tags: [College]
 */
router.get("/:collegeSlug/:hackathonSlug", getHackathonBySlug);

export default router;