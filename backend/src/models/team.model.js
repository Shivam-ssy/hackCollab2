import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hackathon",
      required: true,
      index: true,
    },

    // 🔥 Leader (single source of truth)
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ Members (INCLUDING leader)
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["leader", "member"],
          default: "member",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // 🔥 Pending join requests
    pendingRequests: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        requestedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // 🔥 Invited users
    invitedUsers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        invitedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // 🔥 Team visibility
    isPrivate: {
      type: Boolean,
      default: false,
    },

    // 🧠 Project Info
    projectTitle: String,
    projectDescription: String,
    githubRepo: String,
    demoLink: String,

    // 📤 Submission
    submissionFile: String,
    submittedAt: Date,

    submissionStatus: {
      type: String,
      enum: ["not_submitted", "submitted"],
      default: "not_submitted",
    },

    // 🏆 Approval / Review
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    score: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
TeamSchema.index({ name: 1, hackathon: 1 }, { unique: true });

// Prevent duplicate members
TeamSchema.index(
  { hackathon: 1, "members.user": 1 },
  { unique: true, sparse: true }
);
export default mongoose.model("Team", TeamSchema);
