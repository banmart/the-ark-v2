

## Fix: Force Edge Function Redeploy

### Problem
The `LOVABLE_API_KEY` secret is configured, and the edge function code correctly uses the Lovable AI Gateway. However, the **deployed version** of the function is still the old one that called Gemini directly (producing 400 errors). The code change from the previous plan wasn't enough to trigger a redeploy.

### Solution — Force redeploy with a meaningful change

**`supabase/functions/chat-assistant/index.ts`**:
- Add a version identifier constant at the top (e.g., `const VERSION = '2.1'`) to ensure Supabase detects a file change and redeploys
- Add a console.log at the start of each request logging the version, so we can confirm the new version is running
- No functional changes needed — the gateway integration code is already correct

This is a one-line addition to force the deploy pipeline to pick up the updated code.

### Also: Clear stale localStorage on the Onboarding page

**`src/pages/Onboarding.tsx`**:
- Bump `CHAT_VERSION` from `'v2'` to `'v3'` so any cached error messages from the old broken function are cleared, and users see the fresh welcome screen with audience buttons

### Files to edit
- `supabase/functions/chat-assistant/index.ts` — add version constant + request log
- `src/pages/Onboarding.tsx` — bump `CHAT_VERSION` to `'v3'`

