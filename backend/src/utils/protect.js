import { verifyJWT } from "../middlewares/auth.middleware.js";
import { loadUserPermissions, requirePermission } from "../middlewares/permission.middleware.js";

export const protect = (permission, controller) => [
  verifyJWT,
  loadUserPermissions,
  requirePermission(permission),
  controller,
];