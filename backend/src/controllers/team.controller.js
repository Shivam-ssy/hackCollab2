import Team from "../models/team.model.js";
import Hackathon from "../models/hackathon.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// ─────────────────────────────────────────────
// CREATE TEAM
// ─────────────────────────────────────────────
export const createTeam = asyncHandler(async (req, res, next) => {
    const { name, hackathon, isPrivate } = req.body;
    const leaderId = req.user._id;

    if (!name || !hackathon) {
        return next(new ApiError(400, "Name and hackathon are required"));
    }

    // ✅ Hackathon validation
    const hack = await Hackathon.findById(hackathon);
    if (!hack) return next(new ApiError(404, "Hackathon not found"));

    const now = new Date();
    if (hack.registrationStart && hack.registrationEnd) {
        if (now < hack.registrationStart || now > hack.registrationEnd) {
            return next(new ApiError(400, "Registration is closed"));
        }
    }

    // ✅ Check user already in team
    const existingTeam = await Team.findOne({
        hackathon,
        "members.user": leaderId,
    });

    if (existingTeam) {
        return next(new ApiError(400, "You are already in a team for this hackathon"));
    }

    // ✅ Unique team name per hackathon
    const duplicate = await Team.findOne({ name, hackathon });
    if (duplicate) {
        return next(new ApiError(409, "Team name already exists"));
    }

    const team = await Team.create({
        name,
        hackathon,
        leader: leaderId,
        isPrivate,
        members: [{ user: leaderId, role: "leader" }],
    });

    return res
        .status(201)
        .json(new ApiResponse(201, team, "Team created successfully"));
});

// ─────────────────────────────────────────────
// GET TEAM BY ID
// ─────────────────────────────────────────────
export const getTeamById = asyncHandler(async (req, res, next) => {
    const team = await Team.findById(req.params.id)
        .populate("members.user", "name email")
        .populate("leader", "name email");

    if (!team) return next(new ApiError(404, "Team not found"));

    return res.status(200).json(new ApiResponse(200, team));
});

// ─────────────────────────────────────────────
// GET MY TEAM (PER HACKATHON)
// ─────────────────────────────────────────────
export const getMyTeam = asyncHandler(async (req, res, next) => {
    const { hackathonId } = req.params;
    const userId = req.user._id;

    const team = await Team.findOne({
        hackathon: hackathonId,
        "members.user": userId,
    }).populate("members.user", "name email");

    if (!team) {
        return next(new ApiError(404, "You are not part of any team"));
    }

    return res.status(200).json(new ApiResponse(200, team));
});

// ─────────────────────────────────────────────
// UPDATE TEAM (LEADER ONLY)
// ─────────────────────────────────────────────
export const updateTeam = asyncHandler(async (req, res, next) => {
    const { name, isPrivate, projectTitle, projectDescription, githubRepo, demoLink } = req.body;

    const team = await Team.findById(req.params.id);
    if (!team) return next(new ApiError(404, "Team not found"));

    // ✅ Only leader can update
    if (team.leader.toString() !== req.user._id.toString()) {
        return next(new ApiError(403, "Only leader can update team"));
    }

    const updateData = {};

    if (name) {
        // ✅ Prevent duplicate name
        const exists = await Team.findOne({
            name,
            hackathon: team.hackathon,
            _id: { $ne: team._id },
        });

        if (exists) {
            return next(new ApiError(409, "Team name already taken"));
        }

        updateData.name = name;
    }

    if (isPrivate !== undefined) updateData.isPrivate = isPrivate;
    if (projectTitle) updateData.projectTitle = projectTitle;
    if (projectDescription) updateData.projectDescription = projectDescription;
    if (githubRepo) updateData.githubRepo = githubRepo;
    if (demoLink) updateData.demoLink = demoLink;

    const updatedTeam = await Team.findByIdAndUpdate(
        team._id,
        updateData,
        { new: true, runValidators: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, updatedTeam, "Team updated successfully"));
});

// ─────────────────────────────────────────────
// DELETE TEAM (LEADER ONLY)
// ─────────────────────────────────────────────
export const deleteTeam = asyncHandler(async (req, res, next) => {
    const team = await Team.findById(req.params.id);
    if (!team) return next(new ApiError(404, "Team not found"));

    if (team.leader.toString() !== req.user._id.toString()) {
        return next(new ApiError(403, "Only leader can delete team"));
    }

    // Optional: prevent delete after hackathon start
    const hack = await Hackathon.findById(team.hackathon);
    if (hack && hack.hackathonStart && new Date() > hack.hackathonStart) {
        return next(new ApiError(400, "Cannot delete team after hackathon starts"));
    }

    await team.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Team deleted successfully"));
});

// ─────────────────────────────────────────────
// LEAVE TEAM
// ─────────────────────────────────────────────
export const leaveTeam = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    const team = await Team.findById(req.params.id);
    if (!team) return next(new ApiError(404, "Team not found"));

    const isMember = team.members.some(
        (m) => m.user.toString() === userId.toString()
    );

    if (!isMember) {
        return next(new ApiError(400, "You are not part of this team"));
    }

    // ❌ Leader leaving
    if (team.leader.toString() === userId.toString()) {
        if (team.members.length === 1) {
            // delete team if only one member
            await team.deleteOne();
            return res
                .status(200)
                .json(new ApiResponse(200, null, "Team deleted"));
        }

        return next(new ApiError(400, "Leader cannot leave. Transfer ownership first"));
    }

    // ✅ Remove member
    team.members = team.members.filter(
        (m) => m.user.toString() !== userId.toString()
    );

    await team.save();

    return res
        .status(200)
        .json(new ApiResponse(200, team, "Left team successfully"));
});

export const submitProject = asyncHandler(async (req, res, next) => {
    const { teamId } = req.params;
    const { githubRepo, demoLink, submissionFile } = req.body;
    const userId = req.user._id;

    // ✅ Validate input
    if (!githubRepo && !demoLink && !submissionFile) {
        return next(
            new ApiError(400, "At least one submission field is required")
        );
    }

    const team = await Team.findById(teamId);
    if (!team) return next(new ApiError(404, "Team not found"));

    // ✅ Check membership
    const isMember = team.members.some(
        (m) => m.user.toString() === userId.toString()
    );

    if (!isMember) {
        return next(new ApiError(403, "You are not a member of this team"));
    }

    // ✅ Hackathon timing validation
    const hack = await Hackathon.findById(team.hackathon);

    const now = new Date();

    if (hack?.hackathonStart && now < hack.hackathonStart) {
        return next(new ApiError(400, "Hackathon has not started yet"));
    }

    if (hack?.hackathonEnd && now > hack.hackathonEnd) {
        return next(new ApiError(400, "Submission deadline has passed"));
    }

    // ⚠️ Optional: prevent resubmission
    if (team.submissionStatus === "submitted") {
        return next(new ApiError(400, "Project already submitted"));
    }

    // ✅ Update safely
    const updateData = {
        submissionStatus: "submitted",
        submittedAt: new Date(),
    };

    if (githubRepo) updateData.githubRepo = githubRepo;
    if (demoLink) updateData.demoLink = demoLink;
    if (submissionFile) updateData.submissionFile = submissionFile;

    const updatedTeam = await Team.findByIdAndUpdate(
        teamId,
        updateData,
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, updatedTeam, "Project submitted successfully"));
});