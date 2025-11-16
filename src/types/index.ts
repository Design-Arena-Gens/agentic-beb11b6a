import type { Timestamp } from "firebase/firestore";

export type UserProfile = {
  id: string;
  email: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  tradeCount: number;
  successfulTrades: number;
};

export type ItemCategory =
  | "Fashion"
  | "Electronics"
  | "Home"
  | "Books"
  | "Toys"
  | "Sports"
  | "Other";

export type Item = {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  images: string[];
  category: ItemCategory;
  tags: string[];
  condition: "New" | "Like New" | "Good" | "Fair";
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isDraft?: boolean;
};

export type TradeStatus = "pending" | "accepted" | "declined" | "cancelled";

export type TradeOffer = {
  id: string;
  senderId: string;
  recipientId: string;
  senderItemId: string;
  recipientItemId: string;
  message: string;
  status: TradeStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
