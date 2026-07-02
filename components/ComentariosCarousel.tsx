"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

interface Comentario {
  instagram: string;
  comentario: string;
}

export default function ComentariosCarousel({
  comentarios,
}: {
  comentarios: Comentario[];
}) {
  const [current, setCurrent] =
    useState(0);

  const startX =
    useRef<number | null>(null);

  useEffect(() => {
    if (comentarios.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev === comentarios.length - 1
          ? 0
          : prev + 1
      );
    }, 4000);

    return () =>
      clearInterval(interval);

  }, [comentarios.length]);

  function next() {
    setCurrent((prev) =>
      prev === comentarios.length - 1
        ? 0
        : prev + 1
    );
  }

  function prev() {
    setCurrent((prev) =>
      prev === 0
        ? comentarios.length - 1
        : prev - 1
    );
  }

  function handleTouchStart(
    e: React.TouchEvent
  ) {
    startX.current =
      e.touches[0].clientX;
  }

  function handleTouchEnd(
    e: React.TouchEvent
  ) {
    if (
      startX.current === null
    ) {
      return;
    }

    const endX =
      e.changedTouches[0].clientX;

    const distance =
      startX.current - endX;

    if (distance > 50) {
      next();
    }

    if (distance < -50) {
      prev();
    }

    startX.current = null;
  }

  if (
    comentarios.length === 0
  ) {
    return null;
  }

  const comentario =
    comentarios[current];

  return (
    <div
      onTouchStart={
        handleTouchStart
      }
      onTouchEnd={
        handleTouchEnd
      }
      className="
        mt-6
        border
        border-violet-200
        rounded-3xl
        p-7
        bg-violet-50
        min-h-[170px]
        flex
        flex-col
        justify-between
        select-none
        shadow-sm
      "
    >
      <div className="flex-1 flex flex-col justify-center text-center">

        <p
          className="
            text-base
            font-semibold
            text-black
            mb-5
            break-all
          "
        >
          <span className="text-violet-600">
            ●
          </span>{" "}
          @{comentario.instagram}
        </p>

        <p
          className="
            text-neutral-700
            text-lg
            leading-relaxed
            px-3
          "
        >
          {comentario.comentario}
        </p>

      </div>

      <div className="flex justify-center gap-2 mt-6">

        {comentarios.map(
          (_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === current
                  ? "bg-violet-600"
                  : "bg-violet-200"
              }`}
            />
          )
        )}

      </div>

    </div>
  );
}