"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Item } from "@/types";

export const useItemsByIds = (ids: string[]) => {
  const [items, setItems] = useState<Record<string, Item>>({});

  useEffect(() => {
    if (!ids.length || !db) return undefined;
    const unsubscribers = ids.map((id) =>
      onSnapshot(doc(db, "items", id), (snapshot) => {
        if (snapshot.exists()) {
          setItems((prev) => ({
            ...prev,
            [id]: { id: snapshot.id, ...(snapshot.data() as Omit<Item, "id">) }
          }));
        }
      })
    );

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [ids]);

  return items;
};
