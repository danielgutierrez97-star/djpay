"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

export default function UploadPhotoButton() {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const router = useRouter();

  async function upload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const formData =
      new FormData();

    formData.append("file", file);

    const response = await fetch(
      "/api/upload-profile-photo",
      {
        method: "POST",
        body: formData,
      }
    );

    const data =
      await response.json();

    if (!data.success) {
      alert(
        data.error ||
          "Error subiendo foto"
      );

      return;
    }

    router.refresh();
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={upload}
      />

      <button
        onClick={() =>
          inputRef.current?.click()
        }
        className="
          mt-3
          text-xl
          text-gray-400
          hover:text-violet-600
          transition
        "
      >
        📷
      </button>
    </>
  );
}