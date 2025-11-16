"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toaster";

type ResetFields = {
  email: string;
};

const ResetPasswordPage = () => {
  const { resetPassword } = useAuth();
  const { push } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetFields>();

  const onSubmit = handleSubmit(async ({ email }) => {
    setSubmitting(true);
    try {
      await resetPassword(email);
      push({
        title: "Password reset email sent",
        description: "Check your inbox for instructions.",
        tone: "success"
      });
    } catch (error) {
      push({
        title: "Unable to send reset email",
        description: error instanceof Error ? error.message : "Unknown error",
        tone: "error"
      });
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Reset password</h1>
        <p className="mt-1 text-sm text-slate-500">
          Remembered your password?{" "}
          <Link href="/login" className="text-primary-600 hover:text-primary-500">
            Go back to login
          </Link>
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Email
          </label>
          <input
            type="email"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email ? (
            <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:cursor-not-allowed disabled:opacity-75"
        >
          {submitting ? "Sending…" : "Send reset link"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
