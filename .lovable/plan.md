

## Fix: Clear Stale Onboarding Chat Cache

### Problem
The onboarding page loads old (broken) messages from `localStorage` key `ark-onboarding-chat`. Since `hasMessages` is `true`, it shows the old error conversation instead of the welcome screen with audience buttons.

### Solution — `src/pages/Onboarding.tsx`

Add a **version key** to the storage. When the version changes (like after this fix), stale messages are auto-cleared so users see the fresh welcome screen.

1. Add a `CHAT_VERSION` constant (e.g., `'v2'`)
2. In the `useState` initializer, check `localStorage` for `ark-onboarding-chat-version`:
   - If it doesn't match `CHAT_VERSION`, clear saved messages and update the version key
   - If it matches, load messages as normal
3. This ensures all users see the fresh welcome screen after this deploy

### File to edit
- `src/pages/Onboarding.tsx` — add version-gated cache clearing (~5 lines changed in the initializer)

