"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema, RegisterFormData } from "@/lib/authSchema";
import Link from "next/link";
import { useRouter } from "next/navigation";
import apis from "@/lib/api";

function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data:RegisterFormData) => {
    try {
      setIsLoading(true);
      setServerError("");

      const { confirmPassword, ...payload } = data;

      const res= await apis.post("/users/users/create", payload);
      // console.log(res.data);
      
      router.push("/login");
    } catch (error) {
      console.error(error);

      if (error.response) {
        setServerError(error.response.data?.message || "Registration failed");
      } else if (error.request) {
        setServerError("Server not responding. Try again.");
      } else {
        setServerError("Something went wrong.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mesh-bg min-h-screen flex items-center justify-center bg-[var(--background)] px-6 py-12">
      <div className="w-full max-w-lg bg-[var(--card)] border border-[var(--border)] p-8 rounded-2xl shadow-xl backdrop-blur-sm animate-fade-up">

        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
            Join HackHub
          </h2>
          <p className="text-[var(--muted-foreground)] mt-2 font-body">
            Choose your role and start your journey.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Server Error */}
          {serverError && (
            <p className="text-sm text-red-500 text-center">{serverError}</p>
          )}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Name */}
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Full Name"
                {...register("name")}
                className="w-full px-4 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:ring-2 focus:ring-[oklch(0.55_0.22_278)] outline-none transition-all placeholder:text-[var(--muted-foreground)]"
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1 ml-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <input
                type="email"
                placeholder="Email"
                {...register("email")}
                className="w-full px-4 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:ring-2 focus:ring-[oklch(0.55_0.22_278)] outline-none transition-all placeholder:text-[var(--muted-foreground)]"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1 ml-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                placeholder="Password"
                {...register("password")}
                className="w-full px-4 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:ring-2 focus:ring-[oklch(0.55_0.22_278)] outline-none transition-all placeholder:text-[var(--muted-foreground)]"
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1 ml-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword")}
                className="w-full px-4 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:ring-2 focus:ring-[oklch(0.55_0.22_278)] outline-none transition-all placeholder:text-[var(--muted-foreground)]"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1 ml-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Role */}
          <div>
            <p className="text-sm mb-2 text-[var(--muted-foreground)]">Account Type</p>
            <div className="grid grid-cols-3 gap-3">
              {["student", "company", "college"].map((role) => (
                <label key={role} className="cursor-pointer">
                  <input
                    type="radio"
                    value={role}
                    {...register("role")}
                    className="hidden peer"
                  />
                  <div className="peer-checked:bg-[oklch(0.55_0.22_278)] peer-checked:text-white peer-checked:border-[oklch(0.55_0.22_278)] capitalize text-center py-2.5 px-3 rounded-xl border border-[var(--border)] text-[var(--muted-foreground)] text-sm font-medium transition-all hover:border-[oklch(0.55_0.22_278)] hover:text-[oklch(0.55_0.22_278)]">
                    {role}
                  </div>
                </label>
              ))}
            </div>
            {errors.role && (
              <p className="text-xs text-red-500 mt-1 text-center">{errors.role.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[oklch(0.55_0.22_278)] hover:bg-[oklch(0.48_0.22_278)] text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-[var(--muted-foreground)] mt-6 font-body">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[oklch(0.55_0.22_278)] hover:underline font-semibold"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUpPage;