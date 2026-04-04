import mongoose from "mongoose";
import dotenv from "dotenv";
import Role from "../models/role.model.js";

dotenv.config();

// ==============================
// 🔥 DEFAULT ROLES + PERMISSIONS
// ==============================
const rolesData = [
  {
    name: "student",
    description: "Student user",
    permissions: [
      "team:create",
      "team:join",
      "team:leave",
      "team:invite",
      "team:submit",
    ],
  },
  {
    name: "college",
    description: "College admin",
    permissions: [
      "hackathon:create",
      "hackathon:update",
      "hackathon:delete",
      "judge:create",
      "judge:assign",
      "team:view",
    ],
  },
  {
    name: "judge",
    description: "Judge user",
    permissions: [
      "team:view",
      "team:score",
      "team:review",
    ],
  },
  {
    name: "admin",
    description: "Super admin",
    permissions: ["*"], // full access
  },
];


// ==============================
// 🚀 SEED FUNCTION
// ==============================
const seedRoles = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/hackCollab`);

    console.log("✅ Connected to DB");

    for (const role of rolesData) {
      const existingRole = await Role.findOne({ name: role.name });

      if (existingRole) {
        // 🔄 Update permissions if already exists
        existingRole.permissions = role.permissions;
        existingRole.description = role.description;
        await existingRole.save();

        console.log(`🔄 Updated role: ${role.name}`);
      } else {
        // ✅ Create new role
        await Role.create(role);

        console.log(`✅ Created role: ${role.name}`);
      }
    }

    console.log("\n🎉 Role seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding roles:", error);
    process.exit(1);
  }
};


// ==============================
// ▶️ RUN
// ==============================
seedRoles();