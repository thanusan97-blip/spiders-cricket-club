"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type Player = {
  id: number;
  player_id: string;
  name: string;
  role: string | null;
  photo_url: string | null;
};

const teams = [
  "Aathiyadi Super Kings",
  "Balmoral Fighters",
  "Niruvaththampai Knights",
  "Team Tiger",
  "Thunnalai Royals",
  "Vallvai Blues SC UK",
];

const playerRoles = [
  "Batsman",
  "Bowler",
  "All-Rounder",
  "Wicket Keeper",
];

export default function VCTB2026AdminPage() {
  const supabase = createClient();

  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [playerId, setPlayerId] = useState("");
  const [player, setPlayer] = useState<Player | null>(null);

  const [role, setRole] = useState("");
  const [team, setTeam] = useState("");
  const [points, setPoints] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUserEmail(user?.email ?? null);
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setUserEmail(data.user?.email ?? null);
    setPassword("");
    setMessage("Admin login successful.");
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();

    setUserEmail(null);
    setPlayer(null);
    setPlayerId("");
    setRole("");
    setTeam("");
    setPoints("");
    setMessage("Logged out.");
  }

  async function findPlayer() {
    if (!playerId.trim()) {
      setMessage("Enter a Player ID.");
      return;
    }

    setLoading(true);
    setMessage("");
    setPlayer(null);
    setRole("");

    const { data, error } = await supabase
      .from("players")
      .select("id, player_id, name, role, photo_url")
      .eq("player_id", playerId.trim())
      .single();

    if (error || !data) {
      setMessage("Player not found.");
      setLoading(false);
      return;
    }

    setPlayer(data);

    // Automatically use the existing role if the player already has one
    if (data.role) {
      setRole(data.role);
    }

    setLoading(false);
  }

  async function signPlayer() {
    if (!player) {
      setMessage("Find a player first.");
      return;
    }

    if (!role) {
      setMessage("Select the player's role.");
      return;
    }

    if (!team) {
      setMessage("Select a team.");
      return;
    }

    if (!points || Number(points) <= 0) {
      setMessage("Enter valid auction points.");
      return;
    }

    setLoading(true);
    setMessage("");

    // Prevent the same player being signed twice
    const { data: existing } = await supabase
      .from("auction_signings")
      .select("id")
      .eq("player_id", player.player_id)
      .maybeSingle();

    if (existing) {
      setMessage(`${player.name} has already been signed.`);
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("auction_signings").insert({
      player_id: player.player_id,
      role,
      team,
      points: Number(points),
    });

    if (error) {
      setMessage(`Signing failed: ${error.message}`);
      setLoading(false);
      return;
    }

    setMessage(
      `✅ ${player.name} signed by ${team} as ${role} for ${Number(
        points
      ).toLocaleString()} points.`
    );

    setPlayerId("");
    setPlayer(null);
    setRole("");
    setTeam("");
    setPoints("");
    setLoading(false);
  }

  function getPlayerPhoto(player: Player) {
    return `/vctb-2026-players/${player.player_id}.jpeg`;
  }

  // LOGIN SCREEN
  if (!userEmail) {
    return (
      <main className="min-h-screen bg-black px-4 py-16 text-white">
        <div className="mx-auto max-w-md rounded-3xl border border-yellow-500/30 bg-zinc-950 p-8 shadow-2xl">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-yellow-400">
            VCTB 2026
          </p>

          <h1 className="mt-3 text-3xl font-black">
            Auction Admin
          </h1>

          <p className="mt-2 text-sm text-white/60">
            Sign in to access the auction control centre.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 outline-none focus:border-yellow-400"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 outline-none focus:border-yellow-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-yellow-400 px-5 py-3 font-black text-black transition hover:bg-yellow-300 disabled:opacity-50"
            >
              {loading ? "SIGNING IN..." : "ADMIN LOGIN"}
            </button>
          </form>

          {message && (
            <p className="mt-5 text-center text-sm text-red-400">
              {message}
            </p>
          )}
        </div>
      </main>
    );
  }

  // AUCTION CONTROL SCREEN
  return (
    <main className="min-h-screen bg-black px-4 py-10 text-white">
      <div className="mx-auto max-w-3xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-yellow-400">
              VCTB 2026
            </p>

            <h1 className="mt-2 text-3xl font-black md:text-4xl">
              Auction Control Centre
            </h1>

            <p className="mt-2 text-sm text-white/50">
              Logged in as {userEmail}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-red-500/40 px-4 py-2 text-sm font-bold text-red-400 transition hover:bg-red-500/10"
          >
            LOG OUT
          </button>
        </div>

        {/* CONTROL BOX */}
        <div className="rounded-3xl border border-yellow-500/20 bg-zinc-950 p-6 md:p-8">

          {/* PLAYER ID */}
          <label className="text-xs font-black uppercase tracking-[0.2em] text-yellow-400">
            Player ID
          </label>

          <div className="mt-3 flex gap-3">
            <input
              type="text"
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              placeholder="Example: 112"
              className="min-w-0 flex-1 rounded-xl border border-white/20 bg-black px-4 py-3 outline-none focus:border-yellow-400"
            />

            <button
              type="button"
              onClick={findPlayer}
              disabled={loading}
              className="rounded-xl bg-white px-5 py-3 font-black text-black transition hover:bg-yellow-400"
            >
              FIND
            </button>
          </div>

          {/* FOUND PLAYER */}
          {player && (
            <div className="mt-6 flex items-center gap-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4">
              <img
                src={getPlayerPhoto(player)}
                alt={player.name}
                className="h-20 w-20 rounded-full border-2 border-yellow-400 object-cover"
              />

              <div>
                <p className="text-xs font-bold text-yellow-400">
                  PLAYER #{player.player_id}
                </p>

                <h2 className="mt-1 text-xl font-black">
                  {player.name}
                </h2>

                {player.role && (
                  <p className="mt-1 text-sm text-white/60">
                    Existing role: {player.role}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* PLAYER ROLE */}
          <div className="mt-7">
            <label className="text-xs font-black uppercase tracking-[0.2em] text-yellow-400">
              Player Role
            </label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-3 w-full rounded-xl border border-white/20 bg-black px-4 py-3 outline-none focus:border-yellow-400"
            >
              <option value="">Select Player Role</option>

              {playerRoles.map((roleName) => (
                <option key={roleName} value={roleName}>
                  {roleName}
                </option>
              ))}
            </select>

            {player?.role && (
              <p className="mt-2 text-xs text-white/40">
                Existing player-table role has been selected automatically.
                You can change it if required.
              </p>
            )}
          </div>

          {/* TEAM */}
          <div className="mt-7">
            <label className="text-xs font-black uppercase tracking-[0.2em] text-yellow-400">
              Team
            </label>

            <select
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              className="mt-3 w-full rounded-xl border border-white/20 bg-black px-4 py-3 outline-none focus:border-yellow-400"
            >
              <option value="">Select Team</option>

              {teams.map((teamName) => (
                <option key={teamName} value={teamName}>
                  {teamName}
                </option>
              ))}
            </select>
          </div>

          {/* AUCTION POINTS */}
          <div className="mt-7">
            <label className="text-xs font-black uppercase tracking-[0.2em] text-yellow-400">
              Auction Points
            </label>

            <input
              type="number"
              min="1"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              placeholder="Example: 2500"
              className="mt-3 w-full rounded-xl border border-white/20 bg-black px-4 py-3 outline-none focus:border-yellow-400"
            />
          </div>

          {/* SIGN BUTTON */}
          <button
            type="button"
            onClick={signPlayer}
            disabled={loading || !player}
            className="mt-8 w-full rounded-2xl bg-red-600 px-6 py-4 text-lg font-black uppercase tracking-wide transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "PROCESSING..." : "🏏 SIGN PLAYER"}
          </button>

          {/* MESSAGE */}
          {message && (
            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-center font-semibold">
              {message}
            </div>
          )}

        </div>
      </div>
    </main>
  );
}