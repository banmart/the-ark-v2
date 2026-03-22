
Issue confirmed: the frontend is calling `chat-assistant`, but the deployed Edge Function behind that name is still an old version returning **500** with `{"error":"Gemini API error: 400"}`. That’s why the UI falls into `FunctionsHttpError` and shows “Sorry, I encountered an error.”

## Plan to set it up correctly

1. **Hard-switch to a fresh function deployment (avoid stale function issue)**
   - Create a new function name (e.g. `chat-assistant-v2`) using the current Lovable AI Gateway implementation already in repo style.
   - Keep `verify_jwt = false` in `supabase/config.toml` for the new function.
   - Add explicit version logging and return standardized JSON `{ response, error? }`.

2. **Point all chat entrypoints to the new function**
   - Update both:
     - `src/pages/Onboarding.tsx` (Get ARK flow)
     - `src/components/providers/ChatProvider.tsx` (drawer assistant)
   - Use a shared constant for function name so both always stay in sync.

3. **Improve client error handling so failures are visible (not generic)**
   - Handle `FunctionsHttpError` and parse `await error.context.json()` to surface backend message.
   - Show a user-friendly fallback only if no structured error body exists.
   - Keep console logs with context (`status`, `error`, `request id` if available).

4. **Reset stale local chat state**
   - Bump onboarding/chat storage version keys (e.g. `v4`) so old failed conversations do not keep the UI stuck in error history.

5. **Deploy + verify end-to-end**
   - Deploy the new Edge Function.
   - Verify in Network tab that `/functions/v1/chat-assistant-v2` returns `200` with a `response` field.
   - Confirm `/onboarding` starts with the audience buttons, clicking one returns assistant content, and manual typed follow-ups also work.

## Technical details (implementation targets)

- `supabase/functions/chat-assistant-v2/index.ts` (new)
- `supabase/config.toml` (new function block)
- `src/pages/Onboarding.tsx` (invoke target + error parsing + cache version bump)
- `src/components/providers/ChatProvider.tsx` (invoke target + error parsing)

## Why this approach
- Re-deploying under the same function name has already failed to replace the stale runtime behavior.
- Versioned function name guarantees the app hits newly deployed code immediately.
- Better error parsing prevents future “silent generic” failures and speeds up debugging.
