import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      messages: [{ role: "user", content: message }],
    });

    return Response.json({
      reply: response.choices[0]?.message?.content,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Server error";

    return Response.json({ error: message }, { status: 500 });
  }
}