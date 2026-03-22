

## Transform Onboarding Page to AI Chat Coach

Replace the static "Get ARK" sections with a full-page conversational AI onboarding experience using the uploaded skills document as the system prompt.

### Changes

**1. Update Edge Function system prompt** — `supabase/functions/chat-assistant/index.ts`
- Replace the existing system prompt with the uploaded onboarding skills content (5-stage flow: Fund Coinbase → Install Wallet → Transfer ETH → Bridge to PulseChain → Swap for ARK)
- Update contract address to new one (`0xF4a370e64DD4673BAA250C5435100FA98661Db4C`)
- Update fee structure references (1% burn, 1% dao, 4% liquidity, 4% locker)
- Update locker tiers to include Mythic tier and corrected multipliers

**2. Re-enable chat in ChatProvider** — `src/components/providers/ChatProvider.tsx`
- Remove the "temporarily disabled" stub in `sendMessage`
- Actually call the `chat-assistant` edge function via `supabase.functions.invoke('chat-assistant', { body: { message, chatHistory } })`
- Parse response and add assistant message

**3. Rewrite Onboarding page** — `src/pages/Onboarding.tsx`
- Remove all static grouped sections (wallet, bank, bridge, buy, lock)
- Remove ProcessFlow, ServiceCard imports and usage
- Replace with a full-page chat interface containing:
  - Compact header with title "ARK Onboarding Guide"
  - Welcome state with the audience detection question from the skills doc (4 options: brand new / have Coinbase / have wallet / already on PulseChain)
  - Full chat message list with markdown rendering (install `react-markdown`)
  - Chat input at bottom
  - Uses the same ChatMessage/ChatInput components but embedded in-page (not a drawer)
- The page manages its own message state separate from the global ChatProvider (onboarding-specific conversation with `localStorage` key `ark-onboarding-chat`)

**4. Install dependency**
- Add `react-markdown` for rendering AI markdown responses in chat messages

### Files to edit
- `supabase/functions/chat-assistant/index.ts` — new system prompt
- `src/components/providers/ChatProvider.tsx` — re-enable edge function calls
- `src/pages/Onboarding.tsx` — full rewrite to chat UI
- `src/components/chat/ChatMessage.tsx` — add markdown rendering

