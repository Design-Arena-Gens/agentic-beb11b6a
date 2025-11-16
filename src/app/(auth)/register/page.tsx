"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toaster";

type RegisterFields = {
  displayName: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  const { register: createAccount } = useAuth();
  const { push } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFields>();

  const onSubmit = handleSubmit(async (data) => {
    setSubmitting(true);
    try {
      await createAccount(data.email, data.password, data.displayName);
      push({ title: "Account created", tone: "success" });
    } catch (error) {
      push({
        title: "Unable to register",
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
        <h1 className="text-2xl font-semibold text-slate-900">Create account</h1>
        <p className="mt-1 text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="text-primary-600 hover:text-primary-500">
            Log in
          </Link>
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Display name
          </label>
          <input
            type="text"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            {...register("displayName", { required: "Display name is required" })}
          />
          {errors.displayName ? (
            <p className="mt-1 text-xs text-rose-500">{errors.displayName.message}</p>
          ) : null}
        </div>
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
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Password
          </label>
          <input
            type="password"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Password must be at least 8 characters" }
            })}
          />
          {errors.password ? (
            <p className="mt-1 text-xs text-rose-500">{errors.password.message}</p>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:cursor-not-allowed disabled:opacity-75"
        >
          {submitting ? "Creating account…" : "Register"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
