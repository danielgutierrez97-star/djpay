import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export async function GET() {
  return NextResponse.json({
    status: "ok",
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

    if (!amount || !dj) {
      return NextResponse.json(
        {
          success: false,
          error: "Faltan datos",
        },
        { status: 400 }
      );
    }

    const monto = Number(amount);

    if (
      Number.isNaN(monto) ||
      monto < 1000 ||
      monto > 100000
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Monto inválido",
        },
        { status: 400 }
      );
    }

    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: [
          {
            id: "DJPAY",
            title: `Apoyo para ${dj}`,
            quantity: 1,
            unit_price: monto,
            currency_id: "CLP",
          },
        ],

        back_urls: {
          success: "https://www.djpay.cl",
          failure: "https://www.djpay.cl",
          pending: "https://www.djpay.cl",
        },

        auto_return: "approved",

        notification_url:
          "https://www.djpay.cl/api/mp/webhook",

        external_reference: `${dj}-${Date.now()}`,

        metadata: {
          dj,
          instagram: instagram || "",
          comment: comment || "",
        },
      },
    });

    return NextResponse.json({
      success: true,
      init_point: response.init_point,
      id: response.id,
    });

  } catch (error) {
    console.error("ERROR MP:");
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Error creando preferencia",
      },
      { status: 500 }
    );
  }
}