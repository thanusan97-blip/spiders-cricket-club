import Link from "next/link";

export default function AlvaiSuperKingsPage() {
  return (
    <main className="min-h-screen bg-[#eef2ff] px-6 py-20 text-[#071a52]">
      <div className="mx-auto max-w-6xl">
        <Link href="/competitions/vctb2025" className="font-bold hover:underline">
          ← Back to VCTB 2025
        </Link>

        <section className="mt-10 rounded-3xl bg-white p-10 shadow-lg">
          <h1 className="text-6xl font-extrabold">Alvai Super Kings</h1>
          <p className="mt-4 text-2xl text-slate-600">Squad page coming soon</p>
        </section>
      </div>
    </main>
  );
}