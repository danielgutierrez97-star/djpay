"use client";

export default function CopyLinkButton({
  link,
}: {
  link: string;
}) {
  async function copiar() {
    await navigator.clipboard.writeText(link);

    alert("Link copiado al portapapeles.");
  }

  return (
    <button
      onClick={copiar}
      className="
        w-full
        bg-violet-600
        text-white
        rounded-2xl
        p-4
        font-bold
        hover:bg-violet-700
        transition
      "
    >
      📋 Copiar mi link DJPay
    </button>
  );
}