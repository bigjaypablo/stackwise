import { createContext } from "react";
import type { PublicSnapshot } from "@/lib/types";

/** Filled by the server-side loader so pages render with real data from the first byte. */
export const PublicSnapshotContext = createContext<PublicSnapshot | null>(null);
