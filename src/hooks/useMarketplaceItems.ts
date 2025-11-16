"use client";

import { useEffect, useMemo, useState } from "react";
import {
  onSnapshot,
  orderBy,
  query,
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

const parse = (snapshot: QuerySnapshot<DocumentData>): Item[] =>
  snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Item, "id">)
  }));

export const useMarketplaceItems = (filters: Filters) => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    if (!collections.items) return undefined;
    const q = query(collections.items, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(parse(snapshot));
    });
    return () => unsubscribe();
  }, []);

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

  return filteredItems;
};
