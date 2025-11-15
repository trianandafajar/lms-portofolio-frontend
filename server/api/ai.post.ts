import { readBody, defineEventHandler, getQuery } from "h3";

type PromptMessage = {
  type: "system" | "user" | "assistant";
  content: string | undefined;
};

export default defineEventHandler(async (event) => {
  const q = getQuery(event) as Record<string, string | undefined>;
  const type = (q.type || "default").toLowerCase();

  const body = (await readBody(event)) as any;

  const messagesFromClient: PromptMessage[] | undefined = Array.isArray(
    body?.messages
  )
    ? body.messages
    : undefined;

  const prompt = typeof body?.prompt === "string" ? body.prompt : "";

  const config = useRuntimeConfig();
  const GEMINI_KEY =
    config.geminiApiKey;
  const MODEL = config.geminiModel;

  if (!GEMINI_KEY) {
    return {
      success: false,
      error: "Server misconfigured: missing geminiApiKey",
    };
  }

  const templates: Record<string, string> = {
    summary: `You are an expert educational copywriter. Create a short summary (2–3 sentences) in Indonesian.`,
    block: `You are an educational content generator. Create a lesson content block as VALID JSON (no markdown, no backticks). Return only the JSON object, nothing else.`,
    rewrite: `You are a helpful editor. Rewrite the given Indonesian text to be clearer and concise.`,
    mcq: `You are a quiz maker. Based on the topic, create a 4-option MCQ with answer + explanation.`,
    essay: `You are an assessment writer. Create an essay prompt with word limit + rubric.`,
    default: `You are a helpful assistant.`,
  };

  let messages: PromptMessage[] = [];

  if (messagesFromClient?.length) {
    messages = messagesFromClient.map((m) => ({
      type: ["system", "assistant"].includes(m.type) ? m.type : "user",
      content: String(m.content || ""),
    }));
  } else {
    const systemTemplate = templates[type] ?? templates.default;

    messages.push({ type: "system", content: systemTemplate });

    if (!prompt) {
      return { success: false, error: "Missing prompt or messages" };
    }

    messages.push({ type: "user", content: prompt });
  }

  const geminiMessages = messages.map((m) => ({
    role: m.type === "system" ? "user" : m.type,
    parts: [{ text: m.content }],
  }));

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: geminiMessages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: type === "block" ? 1024 : 512,
        },
      }),
    });

    const data = await response.json();

    const out =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(data);

    return {
      success: true,
      type,
      input_messages_count: geminiMessages.length,
      output: out,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || String(err),
      type,
      input_messages_count: geminiMessages.length,
    };
  }
});
