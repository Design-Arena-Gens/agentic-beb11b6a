import type { ItemCategory } from "@/types";

export const ITEM_CATEGORIES: ItemCategory[] = [
  "Fashion",
  "Electronics",
  "Home",
  "Books",
  "Toys",
  "Sports",
  "Other"
];

export const ITEM_CONDITIONS = ["New", "Like New", "Good", "Fair"] as const;
