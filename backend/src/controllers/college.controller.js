/*
|--------------------------------------------------------------------------
| College Controller
|--------------------------------------------------------------------------
|
| Responsibilities:
| - Manage college profile (overview, branding, timeline)
| - Add & manage volunteers
| - Browse companies and request sponsorship
| - Create and manage hackathons
| - Configure platform-level settings for the college
| - Generate dynamic landing page per college (subdomain-based)
|
| This controller acts as the administrative layer for colleges
| operating inside the multi-tenant SaaS architecture.
|--------------------------------------------------------------------------
*/
import User from "../models/user.model.js";
import Hackathon from "../models/hackathon.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// ─────────────────────────────────────────────
// COLLEGE PROFILE
// ─────────────────────────────────────────────

/**
 * GET /api/college/profile
 * Returns the college's own profile
 */
// export const getProfile = asyncHandler(async (req, res, next) => {
//     const userId = req?.user?._id;

//     const user = await User.findById(userId).select("-password -refreshToken");
//     if (!user) {
//         return next(new ApiError(404, "College not found"));
//     }

//     return res
//         .status(200)
//         .json(new ApiResponse(200, user, "College profile fetched successfully"));
// });

/**
 * PATCH /api/college/profile
 * Update the college's profile fields
 */
export const updateProfile = asyncHandler(async (req, res, next) => {
    const userId = req?.user?._id;
    const { name, location, description, website } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        return next(new ApiError(404, "College not found"));
    }

    // ✅ Generate slug if name updated
    if (name) {
        user.collegeProfile.name = name;

        const baseSlug = generateSlug(name);

        let slug = baseSlug;
        let counter = 1;

        // ✅ Ensure unique slug
        while (await User.findOne({ collegeSlug: slug, _id: { $ne: userId } })) {
            slug = `${baseSlug}-${counter++}`;
        }

        user.collegeSlug = slug;
    }

    if (location) user.collegeProfile.location = location;
    if (description) user.collegeProfile.description = description;
    if (website) user.collegeProfile.website = website;

    await user.save();

    return res.status(200).json(
        new ApiResponse(200, user, "College profile updated successfully")
    );
});

/**
 * PATCH /api/college/profile/picture
 * Update the college's profile picture (after upload to Cloudinary/S3)
 */
export const updateProfilePicture = asyncHandler(async (req, res, next) => {
    const userId = req?.user?._id;
    const { profilePic } = req.body;

    if (!profilePic) {
        return next(new ApiError(400, "Profile picture URL is required"));
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { profilePic },
        { new: true }
    ).select("-password -refreshToken");

    if (!user) {
        return next(new ApiError(404, "College not found"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { profilePic: user.profilePic }, "Profile picture updated successfully"));
});


// ─────────────────────────────────────────────
// VOLUNTEER MANAGEMENT
// ─────────────────────────────────────────────

/**
 * GET /api/college/volunteers
 * List all volunteers linked to this college
 */
export const getVolunteers = asyncHandler(async (req, res, next) => {
    const collegeId = req?.user?._id;

    const volunteers = await User.find({
        roles: { $in: ["volunteer"] },
        "studentProfile.collegeId": collegeId,
    }).select("name email profilePic volunteerProfile");

    return res
        .status(200)
        .json(new ApiResponse(200, volunteers, "Volunteers fetched successfully"));
});

/**
 * POST /api/college/volunteers/invite
 * Invite a user to become a volunteer for this college
 * Body: { email }
 */
export const inviteVolunteer = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new ApiError(400, "Email is required"));
    }

    const volunteer = await User.findOne({ email });
    if (!volunteer) {
        return next(new ApiError(404, "User with this email not found"));
    }

    if (volunteer.roles.includes("volunteer")) {
        return next(new ApiError(409, "User is already a volunteer"));
    }

    volunteer.roles.push("volunteer");
    await volunteer.save();

    return res
        .status(200)
        .json(new ApiResponse(200, { volunteerId: volunteer._id }, "Volunteer invited successfully"));
});

/**
 * DELETE /api/college/volunteers/:volunteerId
 * Remove a volunteer from this college
 */
export const removeVolunteer = asyncHandler(async (req, res, next) => {
    const { volunteerId } = req.params;

    const volunteer = await User.findById(volunteerId);
    if (!volunteer) {
        return next(new ApiError(404, "Volunteer not found"));
    }

    volunteer.roles = volunteer.roles.filter((r) => r !== "volunteer");
    await volunteer.save();

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Volunteer removed successfully"));
});


// ─────────────────────────────────────────────
// HACKATHON MANAGEMENT
// ─────────────────────────────────────────────

/**
 * POST /api/college/hackathons
 * Create a new hackathon under this college
 */
export const createHackathon = asyncHandler(async (req, res, next) => {
    const collegeId = req?.user?._id;

    const {
        title,
        description,
        slug,
        bannerImage,
        customDomain,
        registrationStart,
        registrationEnd,
        hackathonStart,
        hackathonEnd,
        minTeamSize,
        maxTeamSize,
        maxTeams,
        tracks,
        prizes,
        isPublic,
    } = req.body;

    if (!title || !description) {
        return next(new ApiError(400, "Title and description are required"));
    }

    // ✅ Auto slug if not provided
    const baseSlug = slug ? generateSlug(slug) : generateSlug(title);

    let finalSlug = baseSlug;
    let counter = 1;

    // ✅ UNIQUE PER COLLEGE
    while (await Hackathon.findOne({ slug: finalSlug, college: collegeId })) {
        finalSlug = `${baseSlug}-${counter++}`;
    }

    // ✅ Date validation
    if (registrationStart && registrationEnd && registrationStart > registrationEnd) {
        return next(new ApiError(400, "Registration start must be before end"));
    }

    if (hackathonStart && hackathonEnd && hackathonStart > hackathonEnd) {
        return next(new ApiError(400, "Hackathon start must be before end"));
    }

    const hackathon = await Hackathon.create({
        title,
        description,
        slug: finalSlug,
        bannerImage,
        customDomain,
        college: collegeId,
        registrationStart,
        registrationEnd,
        hackathonStart,
        hackathonEnd,
        minTeamSize,
        maxTeamSize,
        maxTeams,
        tracks,
        prizes,
        isPublic,
        status: "draft",
    });

    return res.status(201).json(
        new ApiResponse(201, hackathon, "Hackathon created successfully")
    );
});
/**
 * GET /api/college/hackathons
 * List all hackathons belonging to this college
 */
export const getMyHackathons = asyncHandler(async (req, res, next) => {
    const collegeId = req?.user?._id;

    const hackathons = await Hackathon.find({ college: collegeId }).sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, hackathons, "Hackathons fetched successfully"));
});

/**
 * GET /api/college/hackathons/:hackathonId
 * Get details of a single hackathon
 */
export const getHackathonById = asyncHandler(async (req, res, next) => {
    const collegeId = req?.user?._id;
    const { hackathonId } = req.params;

    const hackathon = await Hackathon.findOne({ _id: hackathonId, college: collegeId });
    if (!hackathon) {
        return next(new ApiError(404, "Hackathon not found"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, hackathon, "Hackathon fetched successfully"));
});

/**
 * PATCH /api/college/hackathons/:hackathonId
 * Update hackathon details
 */
export const updateHackathon = asyncHandler(async (req, res, next) => {
    const collegeId = req?.user?._id;
    const { hackathonId } = req.params;

    const hackathon = await Hackathon.findOne({ _id: hackathonId, college: collegeId });
    if (!hackathon) {
        return next(new ApiError(404, "Hackathon not found"));
    }

    const allowedFields = [
        "title", "description", "bannerImage", "customDomain",
        "registrationStart", "registrationEnd", "hackathonStart", "hackathonEnd",
        "minTeamSize", "maxTeamSize", "maxTeams", "tracks", "prizes", "isPublic",
    ];

    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            hackathon[field] = req.body[field];
        }
    });

    await hackathon.save();

    return res
        .status(200)
        .json(new ApiResponse(200, hackathon, "Hackathon updated successfully"));
});

/**
 * PATCH /api/college/hackathons/:hackathonId/status
 * Change hackathon lifecycle status (draft → upcoming → active → completed)
 * Body: { status }
 */
export const updateHackathonStatus = asyncHandler(async (req, res, next) => {
    const collegeId = req?.user?._id;
    const { hackathonId } = req.params;
    const { status } = req.body;

    const validStatuses = ["draft", "upcoming", "active", "completed"];
    if (!status || !validStatuses.includes(status)) {
        return next(new ApiError(400, `Status must be one of: ${validStatuses.join(", ")}`));
    }

    const hackathon = await Hackathon.findOne({ _id: hackathonId, college: collegeId });
    if (!hackathon) {
        return next(new ApiError(404, "Hackathon not found"));
    }

    hackathon.status = status;
    await hackathon.save();

    return res
        .status(200)
        .json(new ApiResponse(200, { status: hackathon.status }, "Hackathon status updated successfully"));
});

/**
 * DELETE /api/college/hackathons/:hackathonId
 * Delete a hackathon (only allowed while in draft)
 */
export const deleteHackathon = asyncHandler(async (req, res, next) => {
    const collegeId = req?.user?._id;
    const { hackathonId } = req.params;

    const hackathon = await Hackathon.findOne({ _id: hackathonId, college: collegeId });
    if (!hackathon) {
        return next(new ApiError(404, "Hackathon not found"));
    }

    if (hackathon.status !== "draft") {
        return next(new ApiError(400, "Only draft hackathons can be deleted"));
    }

    await hackathon.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Hackathon deleted successfully"));
});


// ─────────────────────────────────────────────
// PUBLIC LANDING PAGE
// ─────────────────────────────────────────────

/**
 * GET /api/college/landing/:slug
 * Public endpoint — returns college info + its public hackathons by slug
 */
export const getCollegeLandingPage = asyncHandler(async (req, res, next) => {
    const { collegeSlug } = req.params;

    if (!collegeSlug) {
        return next(new ApiError(400, "College slug is required"));
    }

    const college = await User.findOne({ collegeSlug })
        .select("name collegeProfile profilePic collegeSlug");

    if (!college) {
        return next(new ApiError(404, "College not found"));
    }

    const hackathons = await Hackathon.find({
        college: college._id,
        isPublic: true,
    }).sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                college,
                hackathons,
            },
            "Landing page fetched successfully"
        )
    );
});
export const getHackathonBySlug = asyncHandler(async (req, res, next) => {
    const { collegeSlug, hackathonSlug } = req.params;

    const college = await User.findOne({ collegeSlug });
    if (!college) {
        return next(new ApiError(404, "College not found"));
    }

    const hackathon = await Hackathon.findOne({
        slug: hackathonSlug,
        college: college._id,
        isPublic: true,
    });

    if (!hackathon) {
        return next(new ApiError(404, "Hackathon not found"));
    }

    return res.status(200).json(
        new ApiResponse(200, hackathon, "Hackathon fetched successfully")
    );
});