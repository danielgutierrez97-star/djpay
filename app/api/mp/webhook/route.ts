import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("WEBHOOK RECIBIDO:");
    console.log(body);

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}