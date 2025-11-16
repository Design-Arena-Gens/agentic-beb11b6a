"use client";

import { useEffect, useState } from "react";
import {
  onSnapshot,
  orderBy,
  query,
  where,
  type DocumentData,
  type QuerySnapshot
} from "firebase/firestore";
import { collections } from "@/lib/firebase";
import type { TradeOffer } from "@/types";

const parse = (snapshot: QuerySnapshot<DocumentData>): TradeOffer[] =>
  snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<TradeOffer, "id">)
  }));

export const useTrades = (userId: string | undefined) => {
  const [incoming, setIncoming] = useState<TradeOffer[]>([]);
  const [outgoing, setOutgoing] = useState<TradeOffer[]>([]);

  useEffect(() => {
    if (!userId || !collections.trades) return undefined;
    const incomingQuery = query(
      collections.trades,
      where("recipientId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const outgoingQuery = query(
      collections.trades,
      where("senderId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const unsubscribeIncoming = onSnapshot(incomingQuery, (snapshot) => {
      setIncoming(parse(snapshot));
    });
    const unsubscribeOutgoing = onSnapshot(outgoingQuery, (snapshot) => {
      setOutgoing(parse(snapshot));
    });

    return () => {
      unsubscribeIncoming();
      unsubscribeOutgoing();
    };
  }, [userId]);

  return { incoming, outgoing };
};
