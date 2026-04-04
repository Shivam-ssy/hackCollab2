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

import User from "../models/user.model";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiResponse";

export const updateProfile = asyncHandler(async (req, res, next) => {
    const userId = req?.user?._id;
    const { name, location, description, website } = req.body;
    const user = await User.findById(userId);
    if (!user) {
        next(new ApiError("User not found", 404))
    }
    if (name !== undefined) user.collegeProfile.name = name;
    if (location !== undefined) user.collegeProfile.location = location;
    if (description !== undefined)
        user.collegeProfile.description = description;
    if (website !== undefined) user.collegeProfile.website = website;

    await user.save();
    res.status(200).json(new ApiResponse(200, user, "Profile updated successfully"))
})

export const addVolunteer = asyncHandler(async (req, res, next) => {
    const userId = req?.user?._id;
    const user = await User.findById(userId);
    if (!user) {
        next(new ApiError("User not found", 404))
    }
    const volunteer = user.roles.push("volunteer");
    await user.save();
    res.status(200).json(new ApiResponse(200, volunteer, "Volunteer added successfully"))
})

export const removeVolunteer = asyncHandler(async (req, res, next) => {
    const userId = req?.user?._id;
    const user = await User.findById(userId);
    if (!user) {
        next(new ApiError("User not found", 404))
    }
    const volunteer = user.roles.pull("volunteer");
    await user.save();
    res.status(200).json(new ApiResponse(200, volunteer, "Volunteer removed successfully"))
})

export const getVolunteers = asyncHandler(async (req, res, next) => {
    // get all volunteers of the college/
    // get students who has same collageId in student profile
    const userId = req?.user?._id;
    const user = await User.findById(userId);
    if (!user) {
        next(new ApiError("User not found", 404))
    }
    const volunteers = user.volunteers;
    res.status(200).json(new ApiResponse(200, volunteers, "Volunteers fetched successfully"))
})

    