import Team from "../models/team.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const inviteUser = asyncHandler(async (req, res, next) => {
    const { teamId, userIdToInvite } = req.body;

    if (!teamId || !userIdToInvite) {
        return next(new ApiError(400, "teamId and userId are required"));
    }

    const team = await Team.findOne({
        _id: teamId,
        leader: req.user._id,
    });

    if (!team) {
        return next(new ApiError(403, "Only leaders can invite users"));
    }

    // ❌ Cannot invite yourself
    if (userIdToInvite === req.user._id.toString()) {
        return next(new ApiError(400, "You are already in the team"));
    }

    // ❌ Already a member
    if (team.members.some(m => m.user.toString() === userIdToInvite)) {
        return next(new ApiError(400, "User is already a team member"));
    }

    // ❌ Already invited
    if (team.invitedUsers.some(i => i.user.toString() === userIdToInvite)) {
        return next(new ApiError(400, "User already invited"));
    }

    // ❌ Already in another team
    const existingTeam = await Team.findOne({
        hackathon: team.hackathon,
        "members.user": userIdToInvite,
    });

    if (existingTeam) {
        return next(new ApiError(400, "User already in another team"));
    }

    // ❌ Team full
    const hack = await Hackathon.findById(team.hackathon);
    if (hack?.maxTeamSize && team.members.length >= hack.maxTeamSize) {
        return next(new ApiError(400, "Team is full"));
    }

    await Team.findByIdAndUpdate(teamId, {
        $addToSet: { invitedUsers: { user: userIdToInvite } },
    });

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Invitation sent"));
});

export const acceptInvite = asyncHandler(async (req, res, next) => {
    const { teamId } = req.params;
    const userId = req.user._id;

    const team = await Team.findById(teamId);
    if (!team) return next(new ApiError(404, "Team not found"));

    // ❌ Invite exists
    const invited = team.invitedUsers.some(
        (i) => i.user.toString() === userId.toString()
    );

    if (!invited) {
        return next(new ApiError(400, "No invitation found"));
    }

    // ❌ Already a member
    if (team.members.some(m => m.user.toString() === userId.toString())) {
        return next(new ApiError(400, "Already a member"));
    }

    // ❌ Already in another team
    const existingTeam = await Team.findOne({
        hackathon: team.hackathon,
        "members.user": userId,
    });

    if (existingTeam) {
        return next(new ApiError(400, "You are already in another team"));
    }

    // ❌ Team full
    const hack = await Hackathon.findById(team.hackathon);
    if (hack?.maxTeamSize && team.members.length >= hack.maxTeamSize) {
        return next(new ApiError(400, "Team is full"));
    }

    // ✅ Atomic update
    const updated = await Team.findOneAndUpdate(
        { _id: teamId, "invitedUsers.user": userId },
        {
            $pull: { invitedUsers: { user: userId } },
            $addToSet: { members: { user: userId, role: "member" } },
        },
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, updated, "Welcome to the team!"));
});

export const rejectInvite = asyncHandler(async (req, res, next) => {
    const { teamId } = req.params;
    const userId = req.user._id;

    await Team.findByIdAndUpdate(teamId, {
        $pull: { invitedUsers: { user: userId } },
    });

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Invitation rejected"));
});