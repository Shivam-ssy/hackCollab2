import mongoose from "mongoose";

const HackathonSchema = new mongoose.Schema(
  {
    // Basic Info
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    bannerImage: {
      type: String, // Cloudinary / S3 URL
    },

    // Multi-tenant slug (subdomain)
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    customDomain: {
      type: String, // Optional custom domain
      unique: true,
      sparse: true,
    },

    // College Reference
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },

    // Dates
    registrationStart: Date,
    registrationEnd: Date,
    hackathonStart: Date,
    hackathonEnd: Date,

    // Participation Rules
    minTeamSize: {
      type: Number,
      default: 1,
    },

    maxTeamSize: {
      type: Number,
      default: 4,
    },

    maxTeams: {
      type: Number,
    },

    // Themes / Tracks
    tracks: [
      {
        name: String,
        description: String,
      },
    ],

    // Prizes
    prizes: [
      {
        position: String, // 1st, 2nd
        reward: String,
      },
    ],

    // Status Control
    status: {
      type: String,
      enum: ["draft", "upcoming", "active", "completed"],
      default: "draft",
    },

    isPublic: {
      type: Boolean,
      default: true,
    },

    // Statistics
    totalTeams: {
      type: Number,
      default: 0,
    },

    totalParticipants: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Hackathon", HackathonSchema);
