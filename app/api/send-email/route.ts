import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // ✅ Read frontend request body
    const body = await req.json();

    console.log("✅ API BODY:", body);

    // ✅ Send request to EmailJS
    const response = await fetch(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          service_id: "service_atyalxg",

          template_id: "template_052cwpr",

          public_key: "qDxulvQQBkObSX-lb",

          template_params: {
            name: body.name,

            email: body.email,

            message: body.message,

            title: "Portfolio Contact",
          },
        }),
      }
    );

    // ✅ Read EmailJS response
    const text = await response.text();

    console.log("✅ EMAILJS RESPONSE:", text);

    // ✅ Error handling
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,

          error: text,
        },
        {
          status: 500,
        }
      );
    }

    // ✅ Success response
    return NextResponse.json({
      success: true,

      message: "Email Sent Successfully",
    });
  } catch (error) {
    console.error("❌ SERVER ERROR:", error);

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unknown Error",
      },
      {
        status: 500,
      }
    );
  }
}