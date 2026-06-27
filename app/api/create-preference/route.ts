import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import postgres from "postgres";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

const sql = postgres(process.env.DATABASE_URL!);

export async function GET() {
  return NextResponse.json({
    status: "ok",
    tokenExiste: !!process.env.MERCADOPAGO_ACCESS_TOKEN,
    token:
      process.env.MERCADOPAGO_ACCESS_TOKEN?.substring(
        0,
        20
      ),
  });
}

export async function POST(req: Request) {
  try {
    const {
      amount,
      dj,
      instagram,
      comment,
    } = await req.json();

    console.log("========== DJPAY ==========");
    console.log("DJ:", dj);
    console.log("Instagram:", instagram);
    console.log("Comentario:", comment);
    console.log("Monto:", amount);
    console.log("===========================");

    if (!amount || !dj) {
      return NextResponse.json(
        {
          success: false,
          error: "Faltan datos",
        },
        { status: 400 }
      );
    }

    await sql`
      INSERT INTO tips (
        dj,
        instagram,
        comentario,
        monto
      )
      VALUES (
        ${dj},
        ${instagram || ""},
        ${comment || ""},
        ${amount}
      )
    `;

    const preference = new Preference(client);

    const response =
      await preference.create({
        body: {
          items: [
            {
              id: "DJPAY",
              title: `Apoyo para ${dj}`,
              quantity: 1,
              unit_price: Number(amount),
              currency_id: "CLP",
            },
          ],

          back_urls: {
            success: "https://djpay.cl",
            failure: "https://djpay.cl",
            pending: "https://djpay.cl",
          },

          auto_return: "approved",

          external_reference: `${dj}-${Date.now()}`,
        },
      });

    console.log("========== INIT POINT ==========");
    console.log(response.init_point);
    console.log("================================");

    return NextResponse.json({
      success: true,
      init_point: response.init_point,
      id: response.id,
    });

  } catch (error: any) {

    console.error("========== ERROR MP ==========");
    console.error(error);
    console.error("MESSAGE:", error?.message);
    console.error("CAUSE:", error?.cause);
    console.error("STATUS:", error?.status);
    console.error("RESPONSE:", error?.response);
    console.error("==============================");

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Error desconocido",
        details: error?.response || error,
      },
      { status: 500 }
    );
  }
}