"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

import StoryModal from "./StoryModal";

interface QRCodeCardProps {
  instagram: string;
}

export default function QRCodeCard({
  instagram,
}: QRCodeCardProps) {
  const [qr, setQr] = useState("");
  const [openStory, setOpenStory] = useState(false);

  useEffect(() => {
    async function generarQR() {
      const url = `https://www.djpay.cl/${instagram}`;

      const data = await QRCode.toDataURL(url, {
        width: 900,
        margin: 1,
        errorCorrectionLevel: "H",
      });

      setQr(data);
    }

    generarQR();
  }, [instagram]);

  function descargarQR() {
    if (!qr) return;

    const link = document.createElement("a");

    link.href = qr;
    link.download = `DJPay-QR-${instagram}.png`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <>
      <div className="flex flex-col items-center">

        <div className="w-72 h-72 rounded-3xl border-2 border-gray-200 bg-white flex items-center justify-center">

          {qr ? (
            <img
              src={qr}
              alt="QR DJPay"
              className="w-64 h-64"
            />
          ) : (
            <div className="text-gray-400">
              Generando QR...
            </div>
          )}

        </div>

        <div className="mt-10 w-full space-y-4">

          <button
            onClick={descargarQR}
            className="
              w-full
              border-2
              border-black
              rounded-2xl
              p-4
              font-semibold
              text-black
              hover:bg-gray-50
              transition
            "
          >
            ⬇ Descargar QR
          </button>

          <button
            onClick={() => setOpenStory(true)}
            className="
              w-full
              border-2
              border-black
              rounded-2xl
              p-4
              font-semibold
              text-black
              hover:bg-gray-50
              transition
            "
          >
            ✨ Crear historia
          </button>

        </div>

      </div>

      <StoryModal
        open={openStory}
        onClose={() => setOpenStory(false)}
        qr={qr}
      />
    </>
  );
}