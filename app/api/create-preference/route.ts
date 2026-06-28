import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

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

    if (!amount || !dj) {
      return NextResponse.json(
        {
          success: false,
          error: "Faltan datos",
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