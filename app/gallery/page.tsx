import Link from "next/link";
import Image from "next/image";

const galleryImages = [
  "/gallery/photo1.jpeg",
  "/gallery/photo2.jpeg",
  "/gallery/photo3.jpeg",
  "/gallery/photo4.jpeg",
  "/gallery/photo5.jpeg",
  "/gallery/photo6.jpeg",
];

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-[#eef2ff] px-6 py-24 text-[#071a52]">

      <div className="mx-auto max-w-7xl">

        <Link
          href="/"
          className="mb-10 inline-block font-semibold hover:underline"
        >
          ← Back to Home
        </Link>

        <h1 className="text-5xl font-extrabold">
          Club Gallery
        </h1>

        <p className="mt-4 text-2xl text-slate-600">
          Match day photos and club memories.
        </p>

        <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3">

          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-3xl border border-[#071a52] bg-white shadow-lg transition hover:-translate-y-2 hover:shadow-2xl"
            >

              <Image
                src={image}
                alt={`Gallery ${index + 1}`}
                width={500}
                height={350}
                className="h-[300px] w-full object-cover"
              />

              <div className="p-6">
                <h2 className="text-2xl font-bold">
                  Spiders Sports Club UK
                </h2>

                <p className="mt-2 text-lg text-slate-600">
                  Club gallery image {index + 1}
                </p>
              </div>

            </div>
          ))}

        </div>

      </div>
    </main>
  );
}