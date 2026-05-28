import Image from "next/image";
import Link from "next/link";

const images = Array.from({ length: 29 }, (_, i) => ({
  src: `/gallery/vctb/2025/${i + 1}.jpeg`,
  alt: `VCTB 2025 Photo ${i + 1}`,
}));

export default function VCTB2025Gallery() {
  return (
    <main className="min-h-screen bg-[#eef2ff] px-4 py-12 text-[#071a52] md:px-6 md:py-20">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/gallery"
          className="font-bold hover:underline"
        >
          ← Back to Gallery
        </Link>

        <h1 className="mt-8 text-5xl font-black md:text-6xl">
          VCTB 2025
        </h1>

        <p className="mt-4 text-xl text-slate-600">
          Vadamaradchy Champion T10 Blast 2025 memories.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-3xl bg-white shadow-xl"
            >
              <div className="relative h-72 w-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}