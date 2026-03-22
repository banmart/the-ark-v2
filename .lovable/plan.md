

## Fix Onboarding Chat: Edge Function + Full-Screen Mobile

### Root Cause
The edge function response says `"Gemini API error: 400"` — this is from the **old version** that called Gemini directly. The updated code using the Lovable AI Gateway hasn't deployed. We need to force redeployment by touching the file with a minor change.

Additionally, the system prompt may be hitting a 400 from the gateway due to formatting. We'll simplify the prompt structure to avoid issues.

### Changes

**1. `supabase/functions/chat-assistant/index.ts`** — Force redeploy + harden
- Add a timestamp comment to force Supabase to detect the change and redeploy
- Simplify the system prompt slightly (remove markdown table formatting which can cause issues with some models)
- Ensure `temperature` is lowered to 0.7 for more reliable responses
- Add better error logging to surface the actual gateway response body on failure

**2. `src/pages/Onboarding.tsx`** — Full-screen chat, no nav on mobile
- Remove the `Navigation` component entirely from the onboarding page
- Add a simple back arrow / "The ARK" link at top-left instead
- Make the header compact: just the icon, title, and trash button
- Keep `h-[100dvh]` flex column layout
- Ensure the welcome screen audience buttons are vertically centered
- On error, show friendly message only (current behavior is already correct: "Sorry, I encountered an error. Please try again.")
- Add `overscroll-behavior-none` to prevent pull-to-refresh on mobile
- Remove the onboarding header bar entirely (the chat IS the page)

### Files to edit
- `supabase/functions/chat-assistant/index.ts` — force redeploy, improve error handling
- `src/pages/Onboarding.tsx` — remove Navigation, full-screen chat layout

