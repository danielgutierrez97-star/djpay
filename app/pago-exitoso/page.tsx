"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function PagoExitosoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const dj = searchParams.get("dj");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);

    const timer = setTimeout(() => {
      if (dj) {
        router.push(`/${dj}`);
      } else {
        router.push("/");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [dj, router]);

  const volver = () => {
    if (dj) {
      router.push(`/${dj}`);
    } else {
      router.push("/");
    }
  };

  return (
    <main
      onClick={volver}
      className="min-h-screen bg-neutral-50 flex items-center justify-center p-6"
    >
      <div
        className={`w-full max-w-md border-2 border-black rounded-3xl bg-white shadow-2xl shadow-violet-100 p-8 transition-all duration-700 ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="min-h-[560px] flex flex-col items-center justify-center text-center">
          <div
            className={`w-36 h-36 rounded-full bg-violet-100 flex items-center justify-center mb-14 transition-all duration-700 ${
              visible ? "scale-100" : "scale-75"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.8}
              className={`w-16 h-16 text-violet-600 transition-all duration-700 ${
                visible
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-50"
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1
            className={`text-4xl font-black text-black mb-6 transition-all duration-700 delay-200 ${
              visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
          >
            ¡Gracias!
          </h1>

          <p
            className={`text-lg text-neutral-600 leading-8 transition-all duration-700 delay-300 ${
              visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
          >
            Tu aporte fue enviado
            <br />
            con éxito.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function PagoExitosoPage() {
  return (
    <Suspense fallback={null}>
      <PagoExitosoContent />
    </Suspense>
  );
}