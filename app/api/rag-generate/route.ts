import { z } from "zod";
import { cloudflareAIChat } from "@/lib/cloudflare-ai";
import { rateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";

const Body = z.object({
  query: z.string().min(1).max(500),
  contexts: z.array(z.object({
    n: z.number().int().min(1).max(5),
    title: z.string().max(120),
    text: z.string().max(1500),
  })).min(1).max(5),
});

function fallbackAnswerFromContext(contextText: string, citation: string) {
  const sentences = contextText
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .slice(0, 3);

  return `${sentences.join(" ")} ${citation}`.trim();
}

function cleanRagAnswer(raw: string, fallbackCitation: string, fallbackAnswer: string) {
  const hadInternalText = /(constraint check|wait,?\s+the prompt|the prompt says|draft|attempt|reasoning|analysis|internal)/i.test(raw);
  let text = raw
    .replace(/\r\n/g, "\n")
    .replace(/<think[\s\S]*?<\/think>/gi, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .trim();

  const markers = [...text.matchAll(/(?:^|\n)\s*(?:final\s+(?:answer|response)|answer)\s*:\s*/gi)];
  const lastMarker = markers.at(-1);
  if (lastMarker?.index !== undefined) {
    text = text.slice(lastMarker.index + lastMarker[0].length);
  }

  text = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^(?:[-*]\s*)?(?:constraint check|constraints?|checklist|reasoning|analysis|internal notes?|draft\s*\d*|attempt\s*\d*|wait\b|the prompt says\b|prompt says\b|i need to|we need to)/i.test(line))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .filter((sentence) => !/^(?:constraint check|wait\b|the prompt says|draft|attempt|reasoning|analysis|internal)/i.test(sentence));

  const seen = new Set<string>();
  const unique = sentences.filter((sentence) => {
    const key = sentence.toLowerCase().replace(/\[\d+\]/g, "").replace(/\W+/g, " ").trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const answer = unique.length > 4
    ? (hadInternalText ? unique.slice(-4) : unique.slice(0, 4)).join(" ")
    : (unique.length ? unique.join(" ") : text).trim();

  if (!answer.replace(/\[\d+\]/g, "").trim()) {
    return fallbackAnswer;
  }

  return /\[\d+\]/.test(answer) ? answer : `${answer} ${fallbackCitation}`.trim();
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  const { success } = await rateLimit.rag.limit(ip);
  if (!success) return Response.json({ error: "rate_limited" }, { status: 429 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "bad_request" }, { status: 400 });

  const context = parsed.data.contexts.map((c) => `[${c.n}] ${c.title}: ${c.text}`).join("\n\n");
  const fallbackCitation = `[${parsed.data.contexts[0].n}]`;
  const fallbackAnswer = fallbackAnswerFromContext(parsed.data.contexts[0].text, fallbackCitation);
  try {
    const rawText = await cloudflareAIChat([
      { role: "system", content: "Answer using ONLY the retrieved context below. Cite [n]. Return only the final user-facing answer in 2-4 concise sentences. No markdown, no drafts, no analysis, no constraint checks." },
      { role: "user", content: `RETRIEVED CONTEXT:\n${context}\n\nQUESTION: ${parsed.data.query}` },
    ], { temperature: 0.2, maxTokens: 260 });
    return Response.json({ text: cleanRagAnswer(rawText, fallbackCitation, fallbackAnswer) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "model_error";
    return Response.json({ error: message }, { status: 500 });
  }
}
