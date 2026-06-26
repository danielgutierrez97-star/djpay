"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/backoffice/logout", {
      method: "POST",
    });

    router.push("/backoffice/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className="
        border
        border-black
        rounded-xl
        px-4
        py-2
        text-sm
        font-medium
        hover:bg-violet-50
        transition
      "
    >
      Cerrar sesión
    </button>
  );
}