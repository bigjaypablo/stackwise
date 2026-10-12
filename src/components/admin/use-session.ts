import { useEffect, useState } from "react";
import { getSession, subscribeChanges } from "@/lib/api";
import type { Session } from "@/lib/types";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancel = false;
    const load = () => {
      getSession()
        .then((next) => {
          if (!cancel) {
            setSession(next);
            setReady(true);
          }
        })
        .catch(() => {
          if (!cancel) {
            setSession(null);
            setReady(true);
          }
        });
    };
    load();
    const unsubscribe = subscribeChanges(load);
    return () => {
      cancel = true;
      unsubscribe();
    };
  }, []);

  return { session, ready };
}
