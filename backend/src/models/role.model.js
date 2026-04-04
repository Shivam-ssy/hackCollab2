import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema(
  {
    // ======================
    // Role Name
    // ======================
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // ======================
    // Permissions
    // ======================
    permissions: [
      {
        type: String,
        required: true,
      },
    ],

    // ======================
    // Description
    // ======================
    description: {
      type: String,
      trim: true,
    },

    // ======================
    // System Role (optional 🔥)
    // Prevent accidental deletion
    // ======================
    isSystem: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


// ======================
// INDEXES
// ======================

// Ensure unique role names
// RoleSchema.index({ name: 1 }, { unique: true });


// ======================
// METHODS (Optional)
// ======================

// Check if role has permission
RoleSchema.methods.hasPermission = function (permission) {
  return (
    this.permissions.includes("*") ||
    this.permissions.includes(permission)
  );
};


// ======================
// EXPORT
// ======================
const Role = mongoose.model("Role", RoleSchema);

export default Role;