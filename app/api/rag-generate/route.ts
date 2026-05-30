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

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  const { success } = await rateLimit.rag.limit(ip);
  if (!success) return Response.json({ error: "rate_limited" }, { status: 429 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "bad_request" }, { status: 400 });

  const context = parsed.data.contexts.map((c) => `[${c.n}] ${c.title}: ${c.text}`).join("\n\n");
  try {
    const text = await cloudflareAIChat([
      { role: "system", content: "Answer using ONLY the retrieved context below. Cite [n]. 2-4 sentences. No markdown." },
      { role: "user", content: `RETRIEVED CONTEXT:\n${context}\n\nQUESTION: ${parsed.data.query}` },
    ], { temperature: 0.2, maxTokens: 600 });
    return Response.json({ text });
  } catch (error) {
    const message = error instanceof Error ? error.message : "model_error";
    return Response.json({ error: message }, { status: 500 });
  }
}
