import { z } from "zod";
import { SYSTEM_PERSONA } from "@/app/_lib/persona";
import { cloudflareAIChat } from "@/lib/cloudflare-ai";
import { rateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";

const Body = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().max(2000),
  })).min(1).max(20),
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  const { success } = await rateLimit.chat.limit(ip);
  if (!success) return Response.json({ error: "rate_limited" }, { status: 429 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "bad_request" }, { status: 400 });

  try {
    const text = await cloudflareAIChat([
      { role: "system", content: SYSTEM_PERSONA },
      ...parsed.data.messages,
    ], { maxTokens: 1200 });
    return Response.json({ text });
  } catch (error) {
    const message = error instanceof Error ? error.message : "model_error";
    return Response.json({ error: message }, { status: 500 });
  }
}
