

## Switch Onboarding Chat to Lovable AI Gateway + Fix Layout

### Problems
1. Edge function uses `GOOGLE_GEMINI_API_KEY` which isn't configured — only `LOVABLE_API_KEY` exists
2. Chat area uses `flex-1 overflow-y-auto` but parent doesn't constrain height, so messages expand the page infinitely
3. CORS headers missing required Supabase client headers

### Plan

**1. Rewrite edge function to use Lovable AI Gateway** — `supabase/functions/chat-assistant/index.ts`
- Replace Gemini direct call with `https://ai.gateway.lovable.dev/v1/chat/completions` using `LOVABLE_API_KEY`
- Use OpenAI-compatible format (`messages` array with `role`/`content`)
- Keep the full onboarding system prompt (updated with skills doc content including Internet Money Wallet, slippage 11-12%, all pain points)
- Fix CORS headers to include all required Supabase client headers
- Model: `google/gemini-3-flash-preview`
- Add `maxOutputTokens` equivalent via `max_tokens: 1200`
- Handle 429/402 errors with user-friendly messages

**2. Fix Onboarding page layout for mobile** — `src/pages/Onboarding.tsx`
- Use `h-[calc(100vh)] flex flex-col` with `overflow-hidden` on the outer container so chat area scrolls internally
- Remove `BaseLayout` wrapper (it adds nav padding + footer which breaks full-screen chat) — use just `Navigation` inline
- Set chat messages area to `flex-1 overflow-y-auto` with proper height constraint from parent
- Add `pb-safe` / safe area padding for mobile browsers
- Ensure input stays pinned at bottom on mobile (no keyboard push issues)

**3. Update system prompt with full skills** — embedded in edge function
- Include the complete 5-stage flow with all pain point alerts
- Add Internet Money Wallet as alternative
- Emphasize concise step-by-step replies with external links
- Add instruction: "Keep responses short — 2-4 bullet points per step. Always include clickable links. Never write walls of text."

### Files to edit
- `supabase/functions/chat-assistant/index.ts` — rewrite to Lovable AI Gateway
- `src/pages/Onboarding.tsx` — fix layout, remove BaseLayout, constrain height

