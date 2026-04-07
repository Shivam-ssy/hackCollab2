import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
      index: true,
    },

    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hackathon",
      required: true,
      index: true,
    },

    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🧠 Project Info
    projectTitle: {
      type: String,
      required: true,
    },

    projectDescription: String,

    githubRepo: String,
    demoLink: String,

    files: [
      {
        url: String,
        type: String, // ppt, pdf, zip
      },
    ],

    // 🔁 versioning
    version: {
      type: Number,
      default: 1,
    },

    isFinal: {
      type: Boolean,
      default: false,
    },

    // ⚖️ judging
    scores: [
      {
        judge: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        score: Number,
        feedback: String,
      },
    ],

    totalScore: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["draft", "submitted", "evaluated"],
      default: "draft",
    },

    submittedAt: Date,
  },
  { timestamps: true }
);

// one final submission per team
SubmissionSchema.index(
  { team: 1, isFinal: 1 },
  { unique: true, partialFilterExpression: { isFinal: true } }
);

export default mongoose.model("Submission", SubmissionSchema);