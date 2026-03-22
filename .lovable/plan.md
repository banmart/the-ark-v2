

## Adapt Locker to New ARKLocker Contract

**New locker address**: `0x6cA6624aEdCF03F16b29DD217447c478feC2C096`

### Key Differences from Old Contract

- **7 tiers** (adds MYTHIC between PLATINUM and LEGENDARY): Bronze 1x, Silver 1.5x, Gold 2x, Diamond 3x, Platinum 4x, Mythic 5x, Legendary 7x
- **New ABI functions**: `getProtocolDashboard()`, `getUserDashboard()`, `getUserSummary()`, `getActiveLocks()`, `getAllLockTiersInfo()`, `getTopLockers()`, `pendingReward()`, `pendingRewardsAll()`, `claimReward()` (not `claimRewards`), `lockTokenForOthers()`, `forceUnlockMatured()`, `currentDay()`
- **Different struct fields**: `LockedPosition` now has `lockOwner`, `rewardDebt`, `amountWeight`, `rewardEarned` (not `totalRewardsEarned`)
- **UserStats** has `totalRewardEarned` (not `totalRewardsEarned`), no `pendingRewards` field — use `pendingRewardsAll()` instead
- **State variables renamed**: `lockedTokens` (not `totalLockedTokens`), `rewardsDistributed` (not `totalRewardsDistributed`), `activeLockers` (not `totalActiveLockers`), `lockedWeight` for protocol weight
- **`minLockAmount`**: New minimum lock amount (10,000 ARK default)
- **Leaderboard**: Built-in `getTopLockers()` returns top 100 lockers directly (no need for event scanning)

### Files to Change

**1. `src/utils/constants.ts`**
- Update `LOCKER` and `LOCKER_VAULT_ADDRESS` to `0x6cA6624aEdCF03F16b29DD217447c478feC2C096`
- Rewrite `LOCKER_VAULT_ABI` to match new contract functions
- Add MYTHIC to `LOCK_TIERS` (index 5), LEGENDARY becomes index 6
- Update `LOCKER_CONSTANTS` multipliers: Platinum 40000, add Mythic 50000, Legendary 70000

**2. `src/hooks/locker/types.ts`**
- Add `MYTHIC = 5` to `LockTier` enum, shift `LEGENDARY = 6`

**3. `src/hooks/locker/lockTiers.ts`**
- Add Mythic tier (1095-1459 days, 50000 multiplier)
- Update Platinum maxDays to 1094, Legendary minDays to 1460
- Update Platinum multiplier to 40000, Legendary to 70000

**4. `src/hooks/locker/calculations.ts`**
- Update `calculateAPYRange` to use index 6 (Legendary) instead of 5

**5. `src/hooks/useLockerContractData.ts`** — Major rewrite
- Use `getProtocolDashboard()` for all protocol stats + config in one call
- Use `getUserDashboard()` for user stats + locks in one call
- Use `pendingRewardsAll()` for pending rewards
- Parse new struct fields (`rewardEarned`, `amountWeight`, `lockOwner`)
- Use `lockedWeight` for protocol weight

**6. `src/hooks/locker/contractInteractions.ts`**
- Change `claimRewards()` → `claimReward()` 
- `fetchContractConstants` already works (same constant names on new contract)

**7. `src/hooks/useLockerData.ts`**
- Adjust pending rewards to come from separate `pendingRewardsAll()` call
- Map `rewardEarned` field instead of `totalRewardsEarned`

**8. `src/hooks/useLeaderboardData.ts`**
- Use `getTopLockers()` directly instead of scanning events
- Use `getUserSummary()` for individual user data
- Use `pendingRewardsAll()` for pending rewards

**9. `src/components/locker/tier-legend/tierData.ts`**
- Add MYTHIC tier between PLATINUM and LEGENDARY

### Technical Details

New ABI includes these key functions:
```
getProtocolDashboard() → (ProtocolConfig, totalLockedTokens, totalRewardsDistributed, totalActiveLockers, rewardPool)
getUserDashboard(address) → (UserStats, LockedPosition[])
getUserSummary(address) → (totalLocked, pendingRewards, totalRewardsEarned, activeLocksCount)
getTopLockers() → TopLockers[] (address + locked amount)
pendingRewardsAll(address) → uint256
claimReward() — no args, claims all
claimReward(uint256[]) — claims specific lock IDs
calculateEarlyUnlockPenalty(address, lockID) → (penaltyAmount, userReceives)
```

