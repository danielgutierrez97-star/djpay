"use client";

import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";

import StoryPreview, { type StoryTheme } from "./StoryPreview";

interface StoryModalProps {
  open: boolean;
  onClose: () => void;
  qr: string;
}

const STORY_THEMES: StoryTheme[] = ["minimal","midnight", "aurora"];

export default function StoryModal({
  open,
  onClose,
  qr,
}: StoryModalProps) {
  const [message, setMessage] = useState(
    "APOYA LA MÚSICA"
  );
  const [themeIndex, setThemeIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [isStoryReady, setIsStoryReady] = useState(false);
  const [exportError, setExportError] = useState("");

  const storyRef = useRef<HTMLDivElement>(null);
  const warmUpPromiseRef = useRef<Promise<void> | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const mouseStartXRef = useRef<number | null>(null);
  const theme = STORY_THEMES[themeIndex];

  function handleTemplateSwipe(startX: number, endX: number) {
    const distance = startX - endX;

    if (Math.abs(distance) < 50) return;

    const direction = distance > 0 ? 1 : -1;

    setThemeIndex((currentIndex) =>
      (currentIndex + direction + STORY_THEMES.length) % STORY_THEMES.length
    );
  }

  useEffect(() => {
    let cancelled = false;

    async function prepareStory() {
      setIsStoryReady(false);

      if (!open) {
        warmUpPromiseRef.current = null;
        return;
      }

      if (!qr || !storyRef.current) return;

      setExportError("");

      const images = Array.from(
        storyRef.current.querySelectorAll("img")
      );

      try {
        await Promise.all(images.map((img) => img.decode()));
        await document.fonts?.ready;

        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => resolve())
        );
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => resolve())
        );

        if (!warmUpPromiseRef.current) {
          warmUpPromiseRef.current = toPng(storyRef.current, {
            cacheBust: true,
            pixelRatio: 1,
            canvasWidth: 1080,
            canvasHeight: 1920,
            backgroundColor: "#ffffff",
          })
            .then(() => undefined)
            .catch(() => undefined);
        }

        await warmUpPromiseRef.current;

        if (!cancelled) {
          setIsStoryReady(true);
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setExportError(
            "No pudimos preparar la historia. Inténtalo nuevamente."
          );
        }
      }
    }

    void prepareStory();

    return () => {
      cancelled = true;
    };
  }, [open, qr]);

  async function downloadStory() {
    if (!storyRef.current || !qr || isExporting) return;

    setIsExporting(true);
    setExportError("");

    const images = Array.from(
      storyRef.current.querySelectorAll("img")
    );

    try {
      await Promise.all(
        images.map((img) =>
          img.decode()
            .catch(() => undefined)
        )
      );

      await document.fonts?.ready;

      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => resolve())
      );
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => resolve())
      );

      const dataUrl = await toPng(storyRef.current, {
        cacheBust: true,
        pixelRatio: 1,
        canvasWidth: 1080,
        canvasHeight: 1920,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.download = "djpay-story.png";
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error(error);
      setExportError(
        "No pudimos generar la historia. Inténtalo nuevamente."
      );
    } finally {
      setIsExporting(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 overflow-y-auto">
      <div className="min-h-screen flex items-start justify-center p-6">
        <div className="w-full max-w-md rounded-3xl border-4 border-black bg-white p-8 shadow-2xl my-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black">
              DJPay Studio
            </h2>

            <button
              onClick={onClose}
              className="text-3xl text-gray-500 hover:text-black"
            >
              ×
            </button>
          </div>

          {/* Preview visible */}
          <div
            className="mx-auto w-full max-w-[280px] overflow-hidden"
            onTouchStart={(event) => {
              touchStartXRef.current = event.touches[0].clientX;
            }}
            onTouchEnd={(event) => {
              if (touchStartXRef.current === null) return;

              handleTemplateSwipe(
                touchStartXRef.current,
                event.changedTouches[0].clientX
              );
              touchStartXRef.current = null;
            }}
            onPointerDown={(event) => {
              if (event.pointerType !== "mouse") return;

              mouseStartXRef.current = event.clientX;
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerUp={(event) => {
              if (event.pointerType !== "mouse" || mouseStartXRef.current === null) {
                return;
              }

              handleTemplateSwipe(mouseStartXRef.current, event.clientX);
              mouseStartXRef.current = null;
            }}
            onPointerCancel={(event) => {
              if (event.pointerType === "mouse") {
                mouseStartXRef.current = null;
              }
            }}
          >
            <div
              className="flex transition-transform duration-300"
              style={{ transform: `translateX(-${themeIndex * 100}%)` }}
            >
              {STORY_THEMES.map((template) => (
                <div className="w-full shrink-0" key={template}>
                  <StoryPreview
                    qr={qr}
                    message={message}
                    theme={template}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Preview oculto para exportación */}
          <div
            aria-hidden="true"
            className="pointer-events-none"
            style={{
              position: "fixed",
              top: 0,
              left: "-10000px",
              width: "280px",
            }}
          >
            <StoryPreview
              ref={storyRef}
              qr={qr}
              message={message}
              theme={theme}
            />
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {STORY_THEMES.map((template, index) => (
              <div
                className={`w-2 h-2 rounded-full ${
                  index === themeIndex ? "bg-black" : "bg-gray-300"
                }`}
                key={template}
              />
            ))}
          </div>

          <div className="mt-8">
            <label className="block text-sm font-semibold text-black mb-2">
              Mensaje
            </label>

            <input
              value={message}
              onChange={(e) =>
                setMessage(e.target.value.toUpperCase())
              }
              placeholder="APOYA LA MÚSICA"
              className="
                w-full
                border-2
                border-black
                rounded-2xl
                p-4
                text-black
                placeholder:text-gray-500
                outline-none
              "
            />

          </div>

          <button
            onClick={downloadStory}
            disabled={!qr || !isStoryReady || isExporting}
            className="
              mt-8
              w-full
              border-2
              border-black
              rounded-2xl
              p-4
              font-semibold
              text-black
              hover:bg-gray-50
              transition
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {isExporting
              ? "Generando historia..."
              : isStoryReady
                ? "⬇ Descargar historia"
                : "Preparando historia..."}
          </button>

          {exportError && (
            <p className="mt-3 text-sm text-red-600" role="alert">
              {exportError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
