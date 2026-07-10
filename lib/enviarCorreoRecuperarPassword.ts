import { resend } from "./email";

interface RecuperarPasswordEmail {
  nombre: string;
  email: string;
  token: string;
}

export async function enviarCorreoRecuperarPassword({
  nombre,
  email,
  token,
}: RecuperarPasswordEmail) {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL!;

  const url = `${appUrl}/restablecer-password?token=${token}`;

  await resend.emails.send({
    from: "DJPay <noreply@djpay.cl>",
    to: email,
    subject: "🔒 Restablece tu contraseña de DJPay",

    html: `
      <div style="max-width:600px;margin:auto;padding:40px;font-family:Arial,sans-serif;color:#111827;">

        <div style="text-align:center;margin-bottom:40px;">
          <img
            src="https://www.djpay.cl/logo.png"
            alt="DJPay"
            width="140"
          />
        </div>

        <h2 style="text-align:center;margin-bottom:24px;">
          Recuperar contraseña
        </h2>

        <p>Hola <strong>${nombre}</strong>,</p>

        <p>
          Recibimos una solicitud para restablecer la contraseña de tu cuenta DJPay.
        </p>

        <div style="text-align:center;margin:40px 0;">
          <a
            href="${url}"
            style="
              background:#7c3aed;
              color:#ffffff;
              padding:16px 28px;
              border-radius:14px;
              text-decoration:none;
              font-weight:bold;
              display:inline-block;
            "
          >
            Crear nueva contraseña
          </a>
        </div>

        <p>
          Si el botón no funciona, copia y pega este enlace en tu navegador:
        </p>

        <p style="word-break:break-all;color:#7c3aed;">
          ${url}
        </p>

        <p>
          Este enlace expirará en <strong>30 minutos</strong>.
        </p>

        <p>
          Si no solicitaste este cambio, puedes ignorar este correo. Tu contraseña no será modificada hasta que completes el proceso.
        </p>

        <hr style="margin:40px 0;border:none;border-top:1px solid #e5e7eb;" />

        <p style="text-align:center;color:#6b7280;">
          — Equipo DJPay
        </p>

      </div>
    `,
  });
}