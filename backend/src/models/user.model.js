import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
const UserSchema = new mongoose.Schema(
  {
    // ======================
    // Common Fields
    // ======================
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    profilePic: {
      type: String,
    },

    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      }
    ],

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    // ======================
    // Student Profile
    // ======================
    studentProfile: {
      collegeType: {
        type: String,
        enum: ["registered", "external"],
      },

      collegeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // college user
      },

      collegeName: {
        type: String,
      },

      course: String,

      techStack: [String],

      lookingForTeam: {
        type: Boolean,
        default: false,
      },
    },

    // ======================
    // College Profile
    // ======================
    collegeProfile: {
      name: String,
      location: String,
      description: String,
      website: String,
      isVerified: {
        type: Boolean,
        default: false,
      },
    },
    collegeSlug: {
      type: String,
      unique: true,
      sparse: true, // only for colleges
      lowercase: true,
      trim: true,
      index: true,
    },
    // ======================
    // Company / Sponsor Profile
    // ======================
    companyProfile: {
      companyName: String,
      website: String,
      overview: String,
      isVerified: {
        type: Boolean,
        default: false,
      },
    },

    sponsorProfile: {
      organizationName: String,
      sponsorshipHistory: [
        {
          hackathonId: mongoose.Schema.Types.ObjectId,
          amount: Number,
        },
      ],
    },

    // ======================
    // Volunteer / Mentor / Judge / Alumni
    // ======================
    volunteerProfile: {
      expertise: [String],
      available: Boolean,
    },

    mentorProfile: {
      expertise: [String],
      availability: Boolean,
    },

    judgeProfile: {
      expertise: [String],
      judgingHackathons: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Hackathon",
        },
      ],
    },

    alumniProfile: {
      collegeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      graduationYear: Number,
      currentCompany: String,
      willingToMentor: Boolean,
    },
  },
  { timestamps: true },
);
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});


// ======================
// User Methods
// ======================
// UserSchema.index({ collegeSlug: 1 }, { unique: true, sparse: true });
UserSchema.methods = {
  isPasswordCorrect: async function (password) {
    return await bcrypt.compare(password, this.password);
  },
  generateAccessToken: function () {
    return jwt.sign(
      { _id: this._id, name: this.name, email: this.email, roles: this.roles },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );
  },
  generateRefreshToken: function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
  },
};

const User = mongoose.model("User", UserSchema);
export default User;
