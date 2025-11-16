"use client";

import { useEffect, useMemo, useState } from "react";
import {
  onSnapshot,
  orderBy,
  query,
  where,
  type DocumentData,
  type QuerySnapshot
} from "firebase/firestore";
import { collections } from "@/lib/firebase";
import type { Item, ItemCategory } from "@/types";

type Filters = {
  search?: string;
  category?: ItemCategory | "All";
  view?: "grid" | "list";
};

const parseItems = (snapshot: QuerySnapshot<DocumentData>): Item[] =>
  snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Item, "id">)
  }));

export const useUserItems = (userId: string | undefined, filters: Filters) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !collections.items) {
      setLoading(false);
      return undefined;
    }
    const q = query(
      collections.items,
      where("ownerId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setItems(parseItems(snapshot));
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsubscribe();
  }, [userId]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = filters.search?.toLowerCase();
    return items.filter((item) => {
      const matchesCategory =
        !filters.category || filters.category === "All" || item.category === filters.category;
      const matchesSearch = normalizedSearch
        ? `${item.title} ${item.description} ${item.tags.join(" ")}`.toLowerCase().includes(
            normalizedSearch
          )
        : true;
      return matchesCategory && matchesSearch;
    });
  }, [items, filters.category, filters.search]);

  return {
    items: filteredItems,
    loading
  };
};
