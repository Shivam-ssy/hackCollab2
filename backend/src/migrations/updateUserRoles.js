import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";

dotenv.config();

const migrateRoles = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017", {
            dbName: "hackCollab",
        });
        console.log("✅ Connected to DB");

        const users = await User.find();

        for (const user of users) {
            if (!user.roles || user.roles.length === 0) continue;

            const newRoles = [];

            for (const roleName of user.roles) {
                // roleName is string ("student")
                const roleDoc = await Role.findOne({ name: roleName });

                if (roleDoc) {
                    newRoles.push(roleDoc._id);
                }
            }

            user.roles = newRoles;
            await user.save();

            console.log(`🔄 Updated user: ${user.email}`);
        }

        console.log("🎉 Migration completed");
        process.exit(0);
    } catch (error) {
        console.error("❌ Migration error:", error);
        process.exit(1);
    }
};

migrateRoles();