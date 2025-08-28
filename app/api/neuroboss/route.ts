import OpenAI from "openai";

export async function POST(req: Request) {
  const { project } = await req.json();
  if (!project) {
    return new Response(JSON.stringify({ error: "No project" }), { status: 400 });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const schema = {
    type: "object",
    properties: {
      frameworks: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            steps: { type: "array", items: { type: "string" } },
            why: { type: "string" }
          },
          required: ["name", "steps", "why"]
        }
      },
      quote: {
        type: "object",
        properties: { text: { type: "string" }, author: { type: "string" } },
        required: ["text", "author"]
      }
    },
    required: ["frameworks", "quote"]
  };

  const response = await client.responses.create({
    model: "gpt-5-mini",
    instructions:
      "Ты — Нейробосс. Верни 3 фреймворка для проекта пользователя и одну вдохновляющую цитату.",
    input: [{ role: "user", content: `Project: ${project}` }],
    response_format: {
      type: "json_schema",
      json_schema: { name: "NeurobossResult", schema, strict: true }
    }
  });

  const text = (response as any).output_text ?? "{}";
  try {
    return Response.json(JSON.parse(text));
  } catch {
    return Response.json({
      frameworks: [],
      quote: { text: "Не обязательно видеть всю лестницу — достаточно сделать первый шаг.", author: "М. Л. Кинг" }
    });
  }
}