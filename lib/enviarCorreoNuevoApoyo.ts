import { resend } from "./email";

interface NuevoApoyoEmail {
  nombre: string;
  email: string;
  monto: number;
  neto: number;
  comentario: string;
}

export async function enviarCorreoNuevoApoyo({
  nombre,
  email,
  monto,
  neto,
  comentario,
}: NuevoApoyoEmail) {
  await resend.emails.send({
    from: "DJPay <noreply@djpay.cl>",
    to: email,
    subject: "💜 Recibiste un nuevo apoyo en DJPay",

    text: `Hola ${nombre},

Acabas de recibir un nuevo apoyo.

Monto recibido
$${monto.toLocaleString("es-CL")}

Monto líquido
$${neto.toLocaleString("es-CL")}

Comentario
${comentario || "Sin comentario"}

Puedes revisar el detalle en tu Dashboard DJPay.

— Equipo DJPay`,
  });
}