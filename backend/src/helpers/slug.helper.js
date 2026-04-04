// utils/slug.helper.js
import { generateSlug } from "../utils/slugify.js";
import { nanoid } from "nanoid";

export const generateUniqueCollegeSlug = async (name, UserModel) => {
  const baseSlug = generateSlug(name);

  // 1️⃣ Try clean slug first
  const existing = await UserModel.findOne({ collegeSlug: baseSlug }).lean();

  if (!existing) return baseSlug;

  // 2️⃣ Fallback → random suffix (rare loop)
  let slug;
  let isUnique = false;

  while (!isUnique) {
    slug = `${baseSlug}-${nanoid(4)}`;
    const exists = await UserModel.findOne({ collegeSlug: slug }).lean();
    if (!exists) isUnique = true;
  }

  return slug;
};