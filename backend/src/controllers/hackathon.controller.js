import Hackathon from "../models/hackathon.model.js";
import Submission from "../models/submission.model.js";
import Team from "../models/team.model.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const isCollegeAdmin = (user) =>
  user.roles?.some((r) => r.name === "college_admin");

const isJudge = (user) =>
  user.roles?.some((r) => r.name === "judge");

const isStudent = (user) =>
  user.roles?.some((r) => r.name === "student");

// ─── STUDENT: Get all hackathons visible to a student ─────────────────────────
/**
 * GET /api/hackathons
 */
export const getHackathonsForStudent = async (req, res) => {
  try {
    const user = req.user;
    const studentCollegeId = user?.studentProfile?.collegeId;

    const query = {
      status: { $ne: "draft" },
      $or: [{ isPublic: true }],
    };

    // Also show private hackathons from their own college
    if (studentCollegeId) {
      query.$or.push({ college: studentCollegeId });
    }

    const hackathons = await Hackathon.find(query)
      .populate("college", "collegeProfile.name collegeSlug")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: hackathons });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err });
  }
};

// ─── STUDENT: Get hackathons the student has participated in ──────────────────
/**
 * GET /api/hackathons/participated
 */
export const getParticipatedHackathons = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all teams where this user is a member
    const teams = await Team.find({ members: userId }).select("hackathon").lean();
    const hackathonIds = teams.map((t) => t.hackathon);

    const hackathons = await Hackathon.find({ _id: { $in: hackathonIds } })
      .populate("college", "collegeProfile.name")
      .sort({ hackathonStart: -1 })
      .lean();

    res.json({ success: true, data: hackathons });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err });
  }
};

// ─── COLLEGE: Get hackathons created by this college ─────────────────────────
/**
 * GET /api/hackathons/my
 */
export const getCollegeHackathons = async (req, res) => {
  try {
    const collegeId = req.user._id;

    const hackathons = await Hackathon.find({ college: collegeId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: hackathons });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err });
  }
};

// ─── COLLEGE: Create a hackathon ─────────────────────────────────────────────
/**
 * POST /api/hackathons
 */
export const createHackathon = async (req, res) => {
  try {
    const collegeId = req.user._id;

    const {
      title, description, bannerImage, slug, customDomain,
      registrationStart, registrationEnd,
      hackathonStart, hackathonEnd,
      minTeamSize, maxTeamSize, maxTeams,
      tracks, prizes, status, isPublic,
    } = req.body;

    // Validate slug uniqueness
    const existing = await Hackathon.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: "Slug already taken" });
    }

    const hackathon = await Hackathon.create({
      title, description, bannerImage, slug, customDomain,
      registrationStart, registrationEnd,
      hackathonStart, hackathonEnd,
      minTeamSize: minTeamSize ?? 1,
      maxTeamSize: maxTeamSize ?? 4,
      maxTeams,
      tracks: tracks ?? [],
      prizes: prizes ?? [],
      status: status ?? "draft",
      isPublic: isPublic ?? true,
      college: collegeId,
    });

    res.status(201).json({ success: true, data: hackathon });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Slug or domain already exists" });
    }
    res.status(500).json({ success: false, message: "Server error", error: err });
  }
};

// ─── COLLEGE: Update a hackathon ─────────────────────────────────────────────
/**
 * PATCH /api/hackathons/:id
 */
export const updateHackathon = async (req, res) => {
  try {
    const collegeId = req.user._id;
    const { id } = req.params;

    const hackathon = await Hackathon.findById(id);
    if (!hackathon) {
      return res.status(404).json({ success: false, message: "Hackathon not found" });
    }

    // Ownership guard
    if (hackathon.college.toString() !== collegeId.toString()) {
      return res.status(403).json({ success: false, message: "Not your hackathon" });
    }

    const allowedUpdates = [
      "title", "description", "bannerImage",
      "registrationStart", "registrationEnd",
      "hackathonStart", "hackathonEnd",
      "minTeamSize", "maxTeamSize", "maxTeams",
      "tracks", "prizes", "status", "isPublic",
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        hackathon[field] = req.body[field];
      }
    });

    await hackathon.save();

    res.json({ success: true, data: hackathon });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err });
  }
};

// ─── COLLEGE: Delete a hackathon (only drafts) ────────────────────────────────
/**
 * DELETE /api/hackathons/:id
 */
export const deleteHackathon = async (req, res) => {
  try {
    const collegeId = req.user._id;
    const { id } = req.params;

    const hackathon = await Hackathon.findById(id);
    if (!hackathon) {
      return res.status(404).json({ success: false, message: "Hackathon not found" });
    }

    if (hackathon.college.toString() !== collegeId.toString()) {
      return res.status(403).json({ success: false, message: "Not your hackathon" });
    }

    if (hackathon.status !== "draft") {
      return res.status(400).json({
        success: false,
        message: "Only draft hackathons can be deleted. Consider setting status to completed.",
      });
    }

    await hackathon.deleteOne();
    res.json({ success: true, message: "Hackathon deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err });
  }
};

// ─── JUDGE: Get hackathons assigned to this judge ─────────────────────────────
/**
 * GET /api/hackathons/judging
 */
export const getJudgeHackathons = async (req, res) => {
  try {
    const judgeId = req.user._id;

    // Find submissions where this judge is listed
    const submissions = await Submission.find({
      "scores.judge": judgeId,
    })
      .distinct("hackathon")
      .lean();

    const hackathons = await Hackathon.find({ _id: { $in: submissions } })
      .populate("college", "collegeProfile.name")
      .sort({ hackathonStart: -1 })
      .lean();

    res.json({ success: true, data: hackathons });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err });
  }
};

// ─── JUDGE: Get submissions for a hackathon to score ─────────────────────────
/**
 * GET /api/hackathons/:id/submissions
 */
export const getSubmissionsForJudge = async (req, res) => {
  try {
    const judgeId = req.user._id;
    const { id: hackathonId } = req.params;

    const submissions = await Submission.find({
      hackathon: hackathonId,
      isFinal: true,
      status: { $in: ["submitted", "evaluated"] },
    })
      .populate("team", "name members")
      .lean();

    // Annotate with this judge's existing score (if any)
    const annotated = submissions.map((sub) => {
      const myScore = sub.scores.find(
        (s) => s.judge.toString() === judgeId.toString()
      );
      return {
        ...sub,
        myScore: myScore?.score ?? null,
        myFeedback: myScore?.feedback ?? null,
        scoredByMe: !!myScore,
      };
    });

    res.json({ success: true, data: annotated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err });
  }
};

// ─── JUDGE: Submit / update a score for a submission ─────────────────────────
/**
 * POST /api/submissions/:submissionId/score
 */
export const scoreSubmission = async (req, res) => {
  try {
    const judgeId = req.user._id;
    const { submissionId } = req.params;
    const { score, feedback } = req.body;

    if (typeof score !== "number" || score < 0 || score > 100) {
      return res.status(400).json({ success: false, message: "Score must be a number between 0 and 100" });
    }

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    const existingIdx = submission.scores.findIndex(
      (s) => s.judge.toString() === judgeId.toString()
    );

    if (existingIdx > -1) {
      submission.scores[existingIdx].score = score;
      if (feedback) submission.scores[existingIdx].feedback = feedback;
    } else {
      submission.scores.push({ judge: judgeId, score, feedback: feedback ?? "" });
    }

    const total = submission.scores.reduce((sum, s) => sum + s.score, 0);
    submission.totalScore = Math.round(total / submission.scores.length);
    submission.status = "evaluated";

    await submission.save();

    res.json({
      success: true,
      message: "Score submitted",
      data: {
        submissionId: submission._id,
        totalScore: submission.totalScore,
        scoresCount: submission.scores.length,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err });
  }
};

// ─── SHARED: Get single hackathon detail ─────────────────────────────────────
/**
 * GET /api/hackathons/:slug
 */
export const getHackathonBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const hackathon = await Hackathon.findOne({ slug })
      .populate("college", "collegeProfile collegeSlug")
      .lean();

    if (!hackathon) {
      return res.status(404).json({ success: false, message: "Hackathon not found" });
    }

    res.json({ success: true, data: hackathon });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err });
  }
};