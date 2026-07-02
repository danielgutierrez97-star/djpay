import Image from "next/image";

interface DJAvatarProps {
  foto?: string | null;
  nombre: string;
  size?: number;
}

export default function DJAvatar({
  foto,
  nombre,
  size = 48,
}: DJAvatarProps) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      className="
        relative
        overflow-hidden
        rounded-full
        border-2
        border-black
        ring-4
        ring-violet-500
        shadow-md
        bg-white
        shrink-0
      "
    >
      <Image
        src={foto || "/default-avatar.png"}
        alt={nombre}
        fill
        className="object-cover"
      />
    </div>
  );
}