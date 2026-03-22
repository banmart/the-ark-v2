

## Implement Contract-Supported Features Missing from UI

Three user-callable contract functions exist in the ABI but aren't exposed in the UI:

### 1. "Lock for Others" (Gift Lock) — `lockTokenForOthers(amount, duration, address)`

**File**: `src/components/locker/EnhancedLockInterface.tsx`
- Add a toggle/switch below the amount input: "Lock for another wallet"
- When enabled, show a recipient address input field with validation (valid Ethereum address, not zero address, not own address)
- Pass the recipient address through to a new contract interaction

**File**: `src/hooks/locker/contractInteractions.ts`
- Add `lockTokensForOthers(amount, duration, recipientAddress, signer, CONTRACT_CONSTANTS)` function calling `lockerContract.lockTokenForOthers(amountWei, durationSeconds, recipientAddress)`

**File**: `src/hooks/useLockerData.ts`
- Add `lockTokensForOthers` action that wraps the new contract interaction, handles approval check, and triggers refetch

### 2. Selective Claim — `claimReward(uint256[] lockIds)`

**File**: `src/components/locker/EnhancedUserDashboard.tsx`
- Add per-position "Claim" button on each active lock card (alongside existing unlock button)
- Calls `claimRewardForLocks([lockId])` instead of claiming all

**File**: `src/hooks/locker/contractInteractions.ts`
- Add `claimRewardsForLocks(lockIds, signer)` calling `lockerContract['claimReward(uint256[])'](lockIds)`

**File**: `src/hooks/useLockerData.ts`
- Expose `claimRewardsForLocks` action

### 3. Force Unlock Matured — `forceUnlockMatured(day, maxLocks)`

This is a public utility anyone can call to process expired locks. Add a small utility button in the protocol stats or a dedicated section.

**File**: `src/hooks/locker/contractInteractions.ts`
- Add `forceUnlockMatured(dayToProcess, maxLocks, signer)` function

**File**: `src/components/locker/EnhancedProtocolStats.tsx`
- Add a "Process Matured Locks" button that calls the current day from the contract and processes up to 50 locks

**File**: `src/hooks/useLockerData.ts`
- Expose the function

### Summary of files to edit:
- `src/hooks/locker/contractInteractions.ts` — 3 new functions
- `src/hooks/useLockerData.ts` — expose 3 new actions
- `src/components/locker/EnhancedLockInterface.tsx` — gift lock toggle + address input
- `src/components/locker/EnhancedUserDashboard.tsx` — per-position claim button
- `src/components/locker/EnhancedProtocolStats.tsx` — process matured locks button

