"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { LoginFormData, loginSchema } from "@/lib/authSchema";
import { log } from "console";
function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setServerError("");

      const res = await api.post("/users/users/login", data);
      console.log(res.data);
      
      const token = res?.data?.token;
      if (token) {
        localStorage.setItem("token", token);
      }

      router.push("/");
    } catch (error) {
      console.error(error);

      if (error.response) {
        setServerError(
          error.response.data?.message || "Invalid email or password"
        );
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
    <div className="mesh-bg min-h-screen flex items-center justify-center bg-[var(--background)] px-6">
      <div className="w-full max-w-md bg-[var(--card)] border border-[var(--border)] p-8 rounded-2xl shadow-xl backdrop-blur-sm animate-fade-up">

        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
            Welcome Back
          </h2>
          <p className="text-[var(--muted-foreground)] mt-2 font-body">
            Enter your credentials to access your account.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Server Error */}
          {serverError && (
            <p className="text-sm text-red-500 text-center">{serverError}</p>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-1.5 ml-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              {...register("email")}
              className="w-full px-4 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:ring-2 focus:ring-[oklch(0.55_0.22_278)] outline-none transition-all placeholder:text-[var(--muted-foreground)]"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1 ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-1.5 ml-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className="w-full px-4 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:ring-2 focus:ring-[oklch(0.55_0.22_278)] outline-none transition-all placeholder:text-[var(--muted-foreground)]"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1 ml-1">
                {errors.password.message}
              </p>
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
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-[var(--muted-foreground)] mt-6 font-body">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-[oklch(0.55_0.22_278)] hover:underline font-semibold"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;