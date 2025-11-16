"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { uploadAvatar } from "@/lib/storage";
import { updateProfile } from "@/lib/firestore";
import { useToast } from "@/components/ui/Toaster";

type ProfileFields = {
  displayName: string;
  bio: string;
};

const ProfilePage = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { push } = useToast();
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProfileFields>({
    defaultValues: {
      displayName: profile?.displayName ?? "",
      bio: profile?.bio ?? ""
    }
  });

  useEffect(() => {
    reset({
      displayName: profile?.displayName ?? "",
      bio: profile?.bio ?? ""
    });
  }, [profile, reset]);

  const onSubmit = handleSubmit(async (data) => {
    if (!user) return;
    setSaving(true);
    try {
      await updateProfile(user.uid, {
        displayName: data.displayName,
        bio: data.bio
      });
      await refreshProfile();
      push({ title: "Profile updated", tone: "success" });
    } catch (error) {
      push({
        title: "Unable to update profile",
        description: error instanceof Error ? error.message : "Unknown error",
        tone: "error"
      });
    } finally {
      setSaving(false);
    }
  });

  const onAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadAvatar(user.uid, file);
      await updateProfile(user.uid, { avatarUrl: url });
      await refreshProfile();
      push({ title: "Avatar updated", tone: "success" });
    } catch (error) {
      push({
        title: "Unable to upload avatar",
        description: error instanceof Error ? error.message : "Unknown error",
        tone: "error"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900">Profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          Update your information so traders can get to know you better.
        </p>
      </header>

      <section className="gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg">
              {profile?.avatarUrl ? (
                <Image src={profile.avatarUrl} alt={profile.displayName} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary-100 text-3xl font-semibold text-primary-600">
                  {profile?.displayName?.slice(0, 1) ?? "U"}
                </div>
              )}
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">
                {profile?.displayName ?? "Trader"}
              </p>
              <p className="text-sm text-slate-500">{profile?.email ?? user?.email}</p>
              <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-600 hover:bg-primary-100">
                {uploading ? "Uploading…" : "Update avatar"}
                <input type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
              </label>
            </div>
          </div>
          <div className="grid gap-3 text-sm md:text-right">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Total trades</p>
              <p className="text-lg font-semibold text-slate-900">{profile?.tradeCount ?? 0}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Successful trades</p>
              <p className="text-lg font-semibold text-slate-900">{profile?.successfulTrades ?? 0}</p>
            </div>
          </div>
        </div>
        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Display name
            </label>
            <input
              type="text"
              {...register("displayName", { required: "Display name is required" })}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
            {errors.displayName ? (
              <p className="mt-1 text-xs text-rose-500">{errors.displayName.message}</p>
            ) : null}
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Bio
            </label>
            <textarea
              rows={4}
              {...register("bio", {
                maxLength: { value: 240, message: "Bio should be under 240 characters." }
              })}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
            {errors.bio ? <p className="mt-1 text-xs text-rose-500">{errors.bio.message}</p> : null}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-primary-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-75"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default ProfilePage;
