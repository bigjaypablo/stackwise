import { useEffect, useState } from "react";
import { CloseIcon, XIcon } from "@/components/icons";
import { OWNER, X_FOLLOW_URL } from "@/lib/site";

const STORE_KEY = "stackwise.followbar.until";
const SNOOZE_MS = 14 * 24 * 60 * 60 * 1000;

function isSnoozed(): boolean {
  try {
    return Number(window.localStorage.getItem(STORE_KEY) ?? 0) > Date.now();
  } catch {
    return false;
  }
}

function snooze() {
  try {
    window.localStorage.setItem(STORE_KEY, String(Date.now() + SNOOZE_MS));
  } catch {
    /* storage can be unavailable; the bar just may come back */
  }
}

export function FollowBar() {
  const [show, setShow] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (isSnoozed()) {
      setGone(true);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const card = document.getElementById("author-card");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const cardTop = rect.top + window.scrollY;
      const pastHalfway = window.scrollY > cardTop * 0.5;
      const cardInView = rect.top < window.innerHeight;
      setShow(pastHalfway && !cardInView);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  if (gone || !show) return null;

  return (
    <div className="fade-in fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 mx-auto max-w-md">
      <div className="glass flex items-center gap-3 rounded-full py-2 pl-5 pr-2">
        <p className="min-w-0 flex-1 truncate text-sm font-semibold">Get new research on X</p>
        <a
          href={X_FOLLOW_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            snooze();
            setGone(true);
          }}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-ink px-4 text-sm font-semibold text-white"
        >
          <XIcon className="size-3.5" />
          Follow
        </a>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => {
            snooze();
            setGone(true);
          }}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-ink/60 hover:bg-ink/5"
        >
          <CloseIcon className="size-4" />
        </button>
      </div>
      <span className="sr-only">Follow @{OWNER.handle} on X</span>
    </div>
  );
}
