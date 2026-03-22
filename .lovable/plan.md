

## Adapt Quantum Pillars & Locker Tiers to New ARK Token

### 1. InteractiveQuantumPillars — Update fee percentages

**File**: `src/components/InteractiveQuantumPillars.tsx`

Update max capacity calculations to match new fee structure (1% burn, 1% dao, 4% liquidity, 4% locker):
- Line 94: `currentVolume * 0.02` → `currentVolume * 0.01` (burn is 1%)
- Line 95: `currentVolume * 0.01` → `currentVolume * 0.01` (dao stays 1%)
- Line 96: `currentVolume * 0.03` → `currentVolume * 0.04` (liquidity is 4%)
- Line 97: `rewardPool * 0.01` → `rewardPool * 0.04` (locker is 4%)

Update descriptions to remove "quantum" language and reflect actual mechanics:
- Burn: "1% of every transaction is permanently burned, reducing total supply over time."
- DAO: "1% of every transaction funds the DAO treasury for community governance."
- Liquidity: "4% of every transaction is auto-added to the liquidity pool with threshold-based swaps."
- Vault Rewards: "4% of every transaction flows to the locker vault, rewarding long-term holders with up to 7x multipliers."

### 2. LockerTiersSection — Add MYTHIC tier + fix multipliers

**File**: `src/components/LockerTiersSection.tsx`

- Add **MYTHIC** tier (index 5) between Platinum and Legendary with: icon 🔮, color violet-400, duration "3-4 Years", multiplier "5x"
- Fix **Platinum**: multiplier `5x` → `4x`, duration `3-4 Years` → `2-3 Years`
- Fix **Diamond**: duration `1-3 Years` → `1-2 Years`
- Fix **Legendary**: multiplier `8x` → `7x`
- Update `activeTier` modulo from `% 6` to `% 7`
- Update grid to `lg:grid-cols-3` stays (7 cards across 3 cols works), but could also add a particle for Mythic color

