"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function VCTBScoringLoginPage() {
  const supabase = useMemo(() => createClient(), []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function checkExistingSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        window.location.href = "/vctb/2026/scoring";
        return;
      }

      setChecking(false);
    }

    checkExistingSession();
  }, [supabase]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setMessage("Email or password is incorrect.");
      setLoading(false);
      return;
    }

    window.location.href = "/vctb/2026/scoring";
  }

  if (checking) {
    return (
      <main className="min-h-screen bg-black px-4 py-20 text-center text-white">
        <p className="font-black text-yellow-400">Checking scorer access...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 py-12 text-white">
      <div className="mx-auto max-w-md">
        <div className="rounded-[30px] border border-yellow-400/30 bg-[#080808] p-6 shadow-2xl sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
            VCTB 3.0 • 2026
          </p>

          <h1 className="mt-3 text-3xl font-black">Scorer Login</h1>

          <p className="mt-3 text-sm leading-6 text-white/50">
            Authorised VCTB scorers only. Spectators should use the public Live Match Centre.
          </p>

          <form onSubmit={handleLogin} className="mt-7 space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-wider text-white/45">
                Email
              </span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-4 font-bold text-white outline-none focus:border-yellow-400/50"
                placeholder="scorer@example.com"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-wider text-white/45">
                Password
              </span>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-4 font-bold text-white outline-none focus:border-yellow-400/50"
                placeholder="••••••••"
              />
            </label>

            {message && (
              <div className="rounded-xl border border-red-400/20 bg-red-950/30 p-3 text-sm font-bold text-red-200">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-yellow-400 px-5 py-4 font-black uppercase text-black transition hover:bg-yellow-300 disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In to Scoring"}
            </button>
          </form>

          <a
            href="/vctb/2026#live"
            className="mt-5 block text-center text-sm font-bold text-white/40 hover:text-yellow-400"
          >
            ← Public VCTB Live Centre
          </a>
        </div>
      </div>
    </main>
  );
}