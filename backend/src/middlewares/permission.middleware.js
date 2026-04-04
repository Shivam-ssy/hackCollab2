import User from "../models/user.model.js";
import ApiError  from "../utils/ApiError.js";

// 🔥 Load roles + permissions
export const loadUserPermissions = async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .populate("roles");

  if (!user) return next(new ApiError(401, "Unauthorized"));

  // flatten permissions
  const permissions = user.roles.flatMap(role => role.permissions);

  req.user.permissions = permissions;

  next();
};


// 🔥 Check permission
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (
      req.user.permissions.includes("*") ||
      req.user.permissions.includes(permission)
    ) {
      return next();
    }

    return next(new ApiError(403, "Access denied"));
  };
};