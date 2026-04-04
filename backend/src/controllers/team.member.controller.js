import Team from "../models/team.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const joinTeam = asyncHandler(async (req, res, next) => {
    const { teamId } = req.params;
    const userId = req.user._id;

    const team = await Team.findById(teamId);
    if (!team) return next(new ApiError(404, "Team not found"));

    if (team.isPrivate) {
        return next(new ApiError(400, "This team is private. Request an invite instead."));
    }

    // ❌ Already a member
    if (team.members.some(m => m.user.toString() === userId.toString())) {
        return next(new ApiError(400, "Already a team member"));
    }

    // ❌ Already requested
    if (team.pendingRequests.some(p => p.user.toString() === userId.toString())) {
        return next(new ApiError(400, "Join request already sent"));
    }

    // ❌ Already in another team (same hackathon)
    const existingTeam = await Team.findOne({
        hackathon: team.hackathon,
        "members.user": userId,
    });

    if (existingTeam) {
        return next(new ApiError(400, "You are already in another team"));
    }

    // ❌ Team full (if hackathon has maxTeamSize)
    const hack = await Hackathon.findById(team.hackathon);
    if (hack?.maxTeamSize && team.members.length >= hack.maxTeamSize) {
        return next(new ApiError(400, "Team is full"));
    }

    // ✅ Add request
    await Team.findByIdAndUpdate(teamId, {
        $addToSet: { pendingRequests: { user: userId } },
    });

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Join request sent"));
});
export const acceptJoinRequest = asyncHandler(async (req, res, next) => {
    const { teamId, requesterId } = req.params;

    const team = await Team.findOne({
        _id: teamId,
        leader: req.user._id,
    });

    if (!team) return next(new ApiError(403, "Unauthorized"));

    // ❌ Check request exists
    const hasRequest = team.pendingRequests.some(
        (p) => p.user.toString() === requesterId
    );

    if (!hasRequest) {
        return next(new ApiError(400, "No such join request"));
    }

    // ❌ Already in another team
    const existingTeam = await Team.findOne({
        hackathon: team.hackathon,
        "members.user": requesterId,
    });

    if (existingTeam) {
        return next(new ApiError(400, "User already joined another team"));
    }

    // ❌ Team full
    const hack = await Hackathon.findById(team.hackathon);
    if (hack?.maxTeamSize && team.members.length >= hack.maxTeamSize) {
        return next(new ApiError(400, "Team is full"));
    }

    // ✅ Atomic update
    const updated = await Team.findOneAndUpdate(
        { _id: teamId, "pendingRequests.user": requesterId },
        {
            $pull: { pendingRequests: { user: requesterId } },
            $addToSet: { members: { user: requesterId, role: "member" } },
        },
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, updated, "Member accepted"));
});

export const removeMember = asyncHandler(async (req, res, next) => {
    const { teamId, memberId } = req.params;

    const team = await Team.findOne({
        _id: teamId,
        leader: req.user._id,
    });

    if (!team) return next(new ApiError(403, "Unauthorized"));

    // ❌ Prevent removing leader
    if (memberId === team.leader.toString()) {
        return next(new ApiError(400, "Cannot remove team leader"));
    }

    // ❌ Check member exists
    const isMember = team.members.some(
        (m) => m.user.toString() === memberId
    );

    if (!isMember) {
        return next(new ApiError(400, "User is not a team member"));
    }

    team.members = team.members.filter(
        (m) => m.user.toString() !== memberId
    );

    await team.save();

    return res
        .status(200)
        .json(new ApiResponse(200, team, "Member removed"));
});