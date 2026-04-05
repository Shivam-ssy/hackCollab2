import * as yup from "yup";

/* ================= LOGIN ================= */

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address"
    ),

  password: yup
    .string()
    .min(6, "Min 6 characters")
    .required("Password is required"),
});

/* ✅ TYPE (auto inferred) */
export type LoginFormData = yup.InferType<typeof loginSchema>;


/* ================= REGISTER ================= */

export const registerSchema = yup.object({
  name: yup
    .string()
    .min(3, "Min 3 characters")
    .required("Name is required")
    .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),

  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address"
    ),

  password: yup
    .string()
    .min(8, "Min 8 characters")
    .matches(/[A-Z]/, "One uppercase required")
    .matches(/[0-9]/, "One number required")
    .required("Password is required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password"),

  role: yup
    .string()
    .oneOf(["student", "company", "college"], "Select a role")
    .required("Role is required"),
});

/* ✅ TYPE (auto inferred) */
export type RegisterFormData = yup.InferType<typeof registerSchema>;