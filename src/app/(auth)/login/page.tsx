"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toaster";
import { useState } from "react";
import { GoogleIcon } from "@/components/icons/GoogleIcon";

type LoginFields = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { login, loginWithGoogle } = useAuth();
  const { push } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFields>();

  const onSubmit = handleSubmit(async (data) => {
    setSubmitting(true);
    try {
      await login(data.email, data.password);
      push({ title: "Welcome back!", tone: "success" });
    } catch (error) {
      push({
        title: "Unable to log in",
        description: error instanceof Error ? error.message : "Unknown error",
        tone: "error"
      });
    } finally {
      setSubmitting(false);
    }
  });

  const onGoogle = async () => {
    setSubmitting(true);
    try {
      await loginWithGoogle();
      push({ title: "Logged in with Google", tone: "success" });
    } catch (error) {
      push({
        title: "Google sign-in failed",
        description: error instanceof Error ? error.message : "Unknown error",
        tone: "error"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Log in</h1>
        <p className="mt-1 text-sm text-slate-500">
          New here?{" "}
          <Link href="/register" className="text-primary-600 hover:text-primary-500">
            Create an account
          </Link>
        </p>
      </div>
      <button
        onClick={onGoogle}
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-400 disabled:cursor-not-allowed disabled:opacity-75"
      >
        <GoogleIcon className="h-5 w-5" />
        Continue with Google
      </button>
      <div className="flex items-center">
        <span className="h-px flex-1 bg-slate-200" />
        <span className="px-3 text-xs uppercase tracking-wide text-slate-400">or</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Email
          </label>
          <input
            type="email"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            placeholder="you@example.com"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email ? (
            <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>
          ) : null}
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Password
          </label>
          <input
            type="password"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            placeholder="••••••••"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password ? (
            <p className="mt-1 text-xs text-rose-500">{errors.password.message}</p>
          ) : null}
        </div>
        <div className="text-right">
          <Link
            href="/reset-password"
            className="text-xs font-medium text-primary-600 hover:text-primary-500"
          >
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:cursor-not-allowed disabled:opacity-75"
        >
          {submitting ? "Signing in…" : "Log in"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
