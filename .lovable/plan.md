

## Update Fee Structure on Homepage Pillar Cards

The "Four Quantum Pillars" in `FeaturesSection.tsx` show outdated fee percentages and include a "Reflection" fee that no longer exists.

**Current (wrong):** 2% Burn, 2% Reflection, 3% Liquidity, 2% Vault Rewards = 9%
**Correct:** 1% Burn, 1% DAO, 4% Liquidity, 4% Locker = 10% total

### Changes — `src/components/FeaturesSection.tsx`

Update the `pillars` array (lines 29–102):

1. **Burn** — change `percentage` from `'2%'` to `'1%'`
2. **Replace Reflection with DAO** — change title to `'DAO TREASURY'`, emoji to `'🏛️'`, icon to `Users`, percentage to `'1%'`, subtitle/description to reference DAO governance fund, status to `'COLLECTING'`
3. **Liquidity** — change `percentage` from `'3%'` to `'4%'`
4. **Locker (Vault Rewards)** — change `percentage` from `'2%'` to `'4%'`

No other files need changes.

