import { useState } from "react";
import { MailIcon } from "@/components/icons";
import { addSubscriber } from "@/lib/api";
import { isEmail } from "@/lib/format";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  return (
    <section
      id="newsletter"
      className="glass rounded-[1.75rem] px-4 py-5 sm:px-6"
      aria-labelledby="newsletter-title"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex items-start gap-3 lg:max-w-sm">
          <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-accent shadow-sm">
            <MailIcon className="size-6" />
          </span>
          <div>
            <h2 id="newsletter-title" className="text-lg font-extrabold">
              Stay updated
            </h2>
            <p className="mt-1 text-sm text-ink/70">Tests, comparisons, and the occasional deal. No coin launches.</p>
          </div>
        </div>
        <form
          className="flex w-full flex-col gap-2 sm:flex-row lg:flex-1"
          onSubmit={(event) => {
            event.preventDefault();
            setError("");
            setMessage("");
            if (!isEmail(email)) {
              setError("Enter a valid email.");
              return;
            }
            addSubscriber(email)
              .then(() => {
                setMessage("You're on the list. This demo stores the address in this browser.");
                setEmail("");
              })
              .catch((reason: unknown) => {
                setError(reason instanceof Error ? reason.message : "Could not save that email.");
              });
          }}
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            className="h-12 w-full rounded-full border border-white/80 bg-white/80 px-5 text-sm outline-none focus:ring-2 focus:ring-accent/40 sm:flex-1"
          />
          <button
            type="submit"
            className="h-12 w-full shrink-0 rounded-full bg-accent px-6 text-sm font-semibold text-white hover:bg-accent/90 sm:w-auto"
          >
            Subscribe
          </button>
        </form>
      </div>
      {message ? (
        <p className="mt-3 text-sm text-ink" role="status">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
