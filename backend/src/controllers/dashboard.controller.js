import Team from "../models/team.model.js";
import Submission from "../models/submission.model.js";
import Hackathon from "../models/hackathon.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// ==============================================
// GET /api/dashboard/student
// Returns everything shown on the student dashboard:
//   1. Stats  → My Teams count, Projects Submitted count, Hackathons Attended count
//   2. Sub-stats → active teams, finalist count, won count
//   3. My Registered Hackathons list  (with registration status)
//   4. My Projects list               (with submission status)
// ==============================================
export const getStudentDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // --------------------------------------------------
  // 1. TEAMS  — all teams where this user is a member
  // --------------------------------------------------
  const myTeams = await Team.find({ "members.user": userId })
    .populate("hackathon", "title slug hackathonStart hackathonEnd status registrationStart registrationEnd")
    .lean();

  // "Active teams" = teams whose hackathon is currently active or upcoming
  const activeTeams = myTeams.filter((t) =>
    ["active", "upcoming"].includes(t.hackathon?.status)
  );

  // --------------------------------------------------
  // 2. SUBMISSIONS  — all final submissions for teams
  //    the student is part of
  // --------------------------------------------------
  const myTeamIds = myTeams.map((t) => t._id);

  const mySubmissions = await Submission.find({
    team: { $in: myTeamIds },
    isFinal: true,                 // only count final submissions as "submitted"
  })
    .populate("hackathon", "title slug status hackathonStart hackathonEnd")
    .populate("team", "name")
    .lean();

  // "Finalist" = evaluated submissions with a meaningful totalScore
  // Adjust the threshold to match your judging logic
  const finalistSubmissions = mySubmissions.filter(
    (s) => s.status === "evaluated" && s.totalScore > 0
  );

  // --------------------------------------------------
  // 3. HACKATHONS ATTENDED  — unique hackathons from
  //    the teams the student has been part of
  // --------------------------------------------------
  const hackathonMap = new Map();

  myTeams.forEach((team) => {
    if (team.hackathon) {
      hackathonMap.set(String(team.hackathon._id), team.hackathon);
    }
  });

  const attendedHackathons = [...hackathonMap.values()];

  // "Won" = student has a submission that scored the highest in that hackathon
  // Simple approach: flag hackathons where their submission is evaluated + top score
  // You can replace this with a more complex ranking query later
  const wonHackathonIds = new Set();
  for (const sub of mySubmissions) {
    if (sub.status !== "evaluated") continue;

    // Find the top-scoring submission in the same hackathon
    const topSubmission = await Submission.findOne({
      hackathon: sub.hackathon._id,
      isFinal: true,
      status: "evaluated",
    })
      .sort({ totalScore: -1 })
      .lean();

    if (topSubmission && String(topSubmission._id) === String(sub._id)) {
      wonHackathonIds.add(String(sub.hackathon._id));
    }
  }

  // --------------------------------------------------
  // 4. MY REGISTERED HACKATHONS LIST
  //    (what appears in the "My Registered Hackathons" section)
  //    → unique hackathons from myTeams, with a derived registration status
  // --------------------------------------------------
  const now = new Date();

  const registeredHackathons = attendedHackathons.map((h) => {
    // Derive a human-friendly registration status
    let registrationStatus = "registered";

    if (h.status === "completed") {
      registrationStatus = "completed";
    } else if (h.registrationEnd && now > new Date(h.registrationEnd)) {
      registrationStatus = "closed";
    } else if (h.registrationStart && now < new Date(h.registrationStart)) {
      registrationStatus = "pending";
    } else {
      registrationStatus = "registered";
    }

    return {
      _id: h._id,
      title: h.title,
      slug: h.slug,
      status: h.status,                        // draft | upcoming | active | completed
      registrationStatus,                      // registered | pending | closed | completed
      hackathonStart: h.hackathonStart,
      hackathonEnd: h.hackathonEnd,
    };
  });

  // --------------------------------------------------
  // 5. MY PROJECTS LIST
  //    (what appears in the "My Projects" section)
  //    → all submissions (draft + final) for this student's teams
  // --------------------------------------------------
  const allMySubmissions = await Submission.find({
    team: { $in: myTeamIds },
  })
    .populate("hackathon", "title slug")
    .populate("team", "name")
    .select("projectTitle projectDescription status isFinal totalScore githubRepo demoLink submittedAt hackathon team")
    .lean();

  // Map submission status to a UI-friendly label
  const projectStatusLabel = (sub) => {
    if (sub.status === "evaluated") return "Completed";
    if (sub.status === "submitted") return "Submitted";
    if (sub.isFinal) return "Submitted";
    return "In Progress";
  };

  const myProjects = allMySubmissions.map((sub) => ({
    _id: sub._id,
    projectTitle: sub.projectTitle,
    projectDescription: sub.projectDescription,
    hackathonTitle: sub.hackathon?.title,
    hackathonSlug: sub.hackathon?.slug,
    teamName: sub.team?.name,
    status: projectStatusLabel(sub),           // "Completed" | "Submitted" | "In Progress"
    rawStatus: sub.status,                     // "draft" | "submitted" | "evaluated"
    isFinal: sub.isFinal,
    totalScore: sub.totalScore,
    githubRepo: sub.githubRepo,
    demoLink: sub.demoLink,
    submittedAt: sub.submittedAt,
  }));

  // --------------------------------------------------
  // 6. ASSEMBLE RESPONSE
  // --------------------------------------------------
  const dashboardData = {
    // ── Stat Cards ──────────────────────────────────
    stats: {
      myTeams: {
        total: myTeams.length,
        activeTeams: activeTeams.length,         // shown as "Active teams" under the count
      },
      projectsSubmitted: {
        total: mySubmissions.length,             // final submissions only
        finalists: finalistSubmissions.length,   // shown as "X finalist"
      },
      hackathonsAttended: {
        total: attendedHackathons.length,
        won: wonHackathonIds.size,               // shown as "X won"
      },
    },

    // ── Registered Hackathons List ───────────────────
    registeredHackathons,

    // ── Projects List ────────────────────────────────
    myProjects,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, dashboardData, "Dashboard data fetched successfully"));
});
