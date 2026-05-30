type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type CloudflareAIResponse = {
  success?: boolean;
  result?: {
    response?: string;
    text?: string;
    choices?: Array<{
      text?: string;
      message?: {
        content?: string | null;
        reasoning?: string | null;
      };
    }>;
  };
  errors?: Array<{ message?: string }>;
};

export async function cloudflareAIChat(messages: ChatMessage[], options?: { temperature?: number; maxTokens?: number }) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const model = process.env.CLOUDFLARE_AI_MODEL || "@cf/meta/llama-3.1-8b-instruct";

  if (!accountId || !apiToken) {
    throw new Error("Cloudflare Workers AI is not configured");
  }

  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      messages,
      temperature: options?.temperature ?? 0.35,
      max_tokens: options?.maxTokens ?? 1024,
    }),
  });

  const json = (await response.json().catch(() => ({}))) as CloudflareAIResponse;
  if (!response.ok || json.success === false) {
    throw new Error(json.errors?.[0]?.message || `Cloudflare Workers AI request failed with ${response.status}`);
  }

  return (
    json.result?.response ||
    json.result?.choices?.[0]?.message?.content ||
    json.result?.text ||
    json.result?.choices?.[0]?.text ||
    json.result?.choices?.[0]?.message?.reasoning ||
    ""
  ).trim();
}
