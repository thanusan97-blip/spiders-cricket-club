import Image from "next/image";
import Link from "next/link";

const albums = [
  { title: "BTCL 2026", category: "btcl", year: "2026", cover: "/gallery/btcl/2026/cover.jpg" },
  { title: "BTCL 2025", category: "btcl", year: "2025", cover: "/gallery/btcl/2025/cover.jpg" },
  { title: "BTCL 2024", category: "btcl", year: "2024", cover: "/gallery/btcl/2024/cover.jpg" },
  { title: "VCTB 2026", category: "vctb", year: "2026", cover: "/gallery/vctb/2026/cover.jpg" },
  { title: "VCTB 2025", category: "vctb", year: "2025", cover: "/gallery/vctb/2025/cover.jpg" },
  { title: "VCTB 2024", category: "vctb", year: "2024", cover: "/gallery/vctb/2024/cover.jpg" },
  { title: "ROS CPL 2026", category: "ros-cpl", year: "2026", cover: "/gallery/ros-cpl/2026/cover.jpg" },
  { title: "Ponmaalai Pozhudhu 2024", category: "ponmaalai-pozhudhu", year: "2024", cover: "/gallery/ponmaalai-pozhudhu/2024/cover.jpg" },
];

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-[#eef2ff] px-4 py-12 text-[#071a52] md:px-6 md:py-20">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="font-bold hover:underline">
          ← Back to Home
        </Link>

        <h1 className="mt-8 text-5xl font-black md:text-6xl">
          Gallery
        </h1>

        <p className="mt-4 text-xl text-slate-600">
          Browse photos by competition and season.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {albums.map((album) => (
            <Link
              key={album.title}
              href={`/gallery/${album.category}/${album.year}`}
              className="group overflow-hidden rounded-3xl bg-white shadow-xl transition hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={album.cover}
                  alt={album.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute bottom-0 p-5">
                  <h2 className="text-3xl font-black text-white">
                    {album.title}
                  </h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}