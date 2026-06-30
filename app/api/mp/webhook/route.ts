import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import postgres from "postgres";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

const paymentClient = new Payment(client);

const sql = postgres(process.env.DATABASE_URL!);

const COMISION_DJPAY = 0.12;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("WEBHOOK RECIBIDO:");
    console.log(JSON.stringify(body, null, 2));

    if (body.type !== "payment") {
      return NextResponse.json({ ok: true });
    }

    const paymentId = body.data?.id;

    if (!paymentId) {
      return NextResponse.json({ ok: true });
    }

    const payment = await paymentClient.get({
      id: Number(paymentId),
    });

    console.log("PAGO:", payment);

    if ((payment as any).status !== "approved") {
      console.log(
        "Pago no aprobado:",
        (payment as any).status
      );

      return NextResponse.json({ ok: true });
    }

    // Evitar duplicados
    const existe = await sql`
      SELECT id
      FROM tips
      WHERE payment_id = ${(payment as any).id}
      LIMIT 1
    `;

    if (existe.length > 0) {
      console.log("Pago ya registrado");

      return NextResponse.json({ ok: true });
    }

    const metadata =
      (payment as any).metadata || {};

    const monto =
      Number(
        (payment as any)
          .transaction_amount
      ) || 0;

    // Comisión oficial DJPay: 12%
    const comision =
      Math.round(monto * COMISION_DJPAY);

    const netoDj =
      monto - comision;

    await sql`
      INSERT INTO tips (
        dj,
        instagram,
        comentario,
        monto,
        comision,
        neto_dj,
        estado,
        payment_id,
        fecha_pago,
        liquidado
      )
      VALUES (
        ${metadata.dj || ""},
        ${metadata.instagram || ""},
        ${metadata.comment || ""},
        ${monto},
        ${comision},
        ${netoDj},
        'approved',
        ${(payment as any).id},
        NOW(),
        false
      )
    `;

    console.log(
      "TIP GUARDADA CORRECTAMENTE"
    );

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error("ERROR WEBHOOK:");
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}