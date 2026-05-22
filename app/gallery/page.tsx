export default function GalleryPage() {
  const images = [
    "/gallery/photo1.jpeg",
  "/gallery/photo2.jpeg",
  ];

  return (
    <main className="min-h-screen bg-[#eef2ff] px-6 py-20 text-[#071a52]">
      <div className="mx-auto max-w-7xl">
        <a href="/" className="font-bold">
          ← Back to Home
        </a>

        <h1 className="mt-8 text-5xl font-black">
          Club Gallery
        </h1>

        <p className="mt-4 text-xl text-slate-600">
          Match day photos and club memories.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-3xl border bg-white shadow-sm"
            >
              <img
                src={image}
                alt={`Gallery ${index + 1}`}
                className="h-80 w-full object-cover"
              />

              <div className="p-5">
                <h2 className="text-xl font-black">
                  Spiders Sports Club UK
                </h2>

                <p className="mt-2 text-slate-600">
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