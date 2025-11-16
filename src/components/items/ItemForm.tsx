"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { Item } from "@/types";
import { ITEM_CATEGORIES, ITEM_CONDITIONS } from "@/constants";
import { XMarkIcon } from "@heroicons/react/24/outline";

type ItemFormValues = {
  title: string;
  description: string;
  tags: string;
  category: Item["category"];
  condition: Item["condition"];
  images: FileList;
};

type SubmitPayload = {
  id?: string;
  title: string;
  description: string;
  tags: string[];
  category: Item["category"];
  condition: Item["condition"];
  existingImages: string[];
  newFiles: File[];
};

type ItemFormProps = {
  initialItem?: Item;
  submitting: boolean;
  onSubmit: (values: SubmitPayload) => Promise<void>;
  onCancel: () => void;
};

type PreviewEntry = {
  id: string;
  src: string;
  file?: File;
};

export const ItemForm = ({ initialItem, submitting, onSubmit, onCancel }: ItemFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<ItemFormValues>({
    defaultValues: {
      title: initialItem?.title ?? "",
      description: initialItem?.description ?? "",
      tags: initialItem?.tags.join(", ") ?? "",
      category: initialItem?.category ?? ITEM_CATEGORIES[0],
      condition: initialItem?.condition ?? "Good",
      images: undefined
    }
  });
  const [previews, setPreviews] = useState<PreviewEntry[]>(
    (initialItem?.images ?? []).map((url) => ({ id: url, src: url }))
  );

  const existingImages = previews.filter((preview) => !preview.file).map((preview) => preview.src);
  const newFiles = previews.filter((preview) => preview.file).map((preview) => preview.file!);

  useEffect(() => {
    setValue("title", initialItem?.title ?? "");
    setValue("description", initialItem?.description ?? "");
    setValue("tags", initialItem?.tags.join(", ") ?? "");
    setValue("category", initialItem?.category ?? ITEM_CATEGORIES[0]);
    setValue("condition", initialItem?.condition ?? "Good");
    setPreviews((initialItem?.images ?? []).map((url) => ({ id: url, src: url })));
  }, [initialItem, setValue]);

  const handleImageChange = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    if (newFiles.length + previews.length > 5) {
      alert("You can upload up to 5 images per item.");
      return;
    }
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviews((prev) => [
            ...prev,
            { id: crypto.randomUUID(), src: event.target?.result as string, file }
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setPreviews((prev) => prev.filter((_, idx) => idx !== index));
  };

  const submitHandler = handleSubmit(async (data) => {
    const payload = {
      id: initialItem?.id,
      title: data.title,
      description: data.description,
      tags: data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      category: data.category,
      condition: data.condition,
      existingImages,
      newFiles
    };
    await onSubmit(payload);
  });

  return (
    <form onSubmit={submitHandler} className="space-y-5">
      <div>
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Title</label>
        <input
          type="text"
          {...register("title", { required: "Title is required" })}
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
        {errors.title ? <p className="mt-1 text-xs text-rose-500">{errors.title.message}</p> : null}
      </div>
      <div>
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Description
        </label>
        <textarea
          rows={4}
          {...register("description", { required: "Description is required" })}
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
        {errors.description ? (
          <p className="mt-1 text-xs text-rose-500">{errors.description.message}</p>
        ) : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Category
          </label>
          <select
            {...register("category")}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          >
            {ITEM_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Condition
          </label>
          <select
            {...register("condition")}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          >
            {ITEM_CONDITIONS.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Tags (comma separated)
        </label>
        <input
          type="text"
          {...register("tags")}
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
      </div>
      <div>
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Upload images
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          {...register("images")}
          onChange={(event) => handleImageChange(event.target.files)}
          className="mt-2 block w-full text-sm"
        />
        <p className="mt-1 text-xs text-slate-400">Up to five images per item.</p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {previews.map((preview, index) => (
            <div key={preview.id} className="group relative h-28 overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview.src} alt="Preview" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 transition group-hover:opacity-100"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-primary-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-75"
        >
          {submitting ? "Saving…" : initialItem ? "Update item" : "Create item"}
        </button>
      </div>
    </form>
  );
};
