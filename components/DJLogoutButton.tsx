"use client";

import { useRouter } from "next/navigation";

interface DJLogoutButtonProps {
  variant?: "default" | "compact";
}

export default function DJLogoutButton({
  variant = "default",
}: DJLogoutButtonProps) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/logout-dj", {
      method: "POST",
    });

    router.push("/login");
    router.refresh();
  }

  if (variant === "compact") {
    return (
      <button
        onClick={logout}
        className="
          border-2
          border-black
          rounded-xl
          px-4
          py-2
          text-sm
          font-medium
          text-black
          hover:bg-gray-100
          transition
        "
      >
        Salir
      </button>
    );
  }

  return (
    <button
      onClick={logout}
      className="
        w-full
        border-2
        border-black
        rounded-2xl
        p-4
        font-bold
        text-black
        hover:bg-gray-100
        transition
      "
    >
      Cerrar sesión
    </button>
  );
}