"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const images = Array.from({ length: 20 }, (_, i) => ({
  src: `/gallery/ponmaalai-pozhudhu/2024/${i + 1}.jpeg`,
}));

export default function PonmaalaiPozhudhu2024Gallery() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <main className="min-h-screen bg-[#eef2ff] px-4 py-12 md:px-6 md:py-20">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/gallery"
          className="font-bold text-[#071a52] hover:underline"
        >
          ← Back to Gallery
        </Link>

        <h1 className="mt-8 text-5xl font-black text-[#071a52] md:text-6xl">
          Ponmaalai Pozhudhu 2024
        </h1>

        <p className="mt-4 text-xl text-slate-600">
          Annual year-end party memories.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, i) => (
            <button
              key={i}
              onClick={() => {
                setIndex(i);
                setOpen(true);
              }}
              className="group overflow-hidden rounded-3xl bg-white shadow-xl"
            >
              <div className="relative h-72 w-full">
                <Image
                  src={image.src}
                  alt={`Ponmaalai Pozhudhu 2024 ${i + 1}`}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                />
              </div>
            </button>
          ))}
        </div>

        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={index}
          slides={images}
        />
      </div>
    </main>
  );
}