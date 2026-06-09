// ======================================================
// ✅ IMPORTS
// ======================================================

import Groq from "groq-sdk";

import resumeData from "@/data/resume";

// ======================================================
// ✅ GROQ CONFIG
// ======================================================

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ======================================================
// ✅ API ROUTE
// ======================================================

export async function POST(
  req: Request
) {

  try {

    // ✅ GET REQUEST BODY
    const body =
      await req.json();

    // ======================================================
    // ✅ GROQ AI REQUEST
    // ======================================================

    const completion =
      await groq.chat.completions.create({

        model: "llama3-8b-8192",

        messages: [

          // ✅ SYSTEM PROMPT

          {
            role: "system",

            content: `
              You are an AI Portfolio Assistant
              for Uttej Kumar.

              Use ONLY the following resume data
              to answer questions.

              Resume Data:
              ${resumeData}

              Rules:
              - Be professional
              - Keep answers concise
              - Answer only from resume
              - Do not generate fake information
            `,
          },

          // ✅ CONVERSATION HISTORY

          ...body.history,

          // ✅ USER MESSAGE

          {
            role: "user",
            content: body.message,
          },
        ],

        temperature: 0.7,
      });

    // ======================================================
    // ✅ RESPONSE
    // ======================================================

    return Response.json({

      reply:
        completion.choices[0]
          .message.content,

    });

  } catch (error: unknown) {

    // ✅ ERROR LOGGING

    if (error instanceof Error) {

      console.log(
        "Groq Error:",
        error.message
      );
    }

    // ✅ ERROR RESPONSE

    return Response.json({

      reply:
        "❌ AI Backend Error",

    });
  }
}