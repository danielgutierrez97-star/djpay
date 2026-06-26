"use client";

import { useRouter } from "next/navigation";

export default function DJLogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/logout-dj", {
      method: "POST",
    });

    router.push("/login");
    router.refresh();
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