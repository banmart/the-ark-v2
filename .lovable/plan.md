

## Adapt Datapoints to New Token Contract

The new token contract (`0xF4a370e64DD4673BAA250C5435100FA98661Db4C`) has a different fee structure and ABI compared to the old one. Here's the plan:

### Key Contract Differences
- **No reflection fee** — replaced by `daoFee`
- **New fee values**: liquidity 4%, locker 4%, burn 1%, dao 1% (total 10%)
- **New functions**: `PAIR()`, `BURN()`, `USDC()`, `ARKDAO()`, `updateFees()`, `distributeLockerRewards()`, `sendDAORewards()`, `recoverPLS()`, `recoverTokens()`
- **Removed**: `pulseXPair()`, `burnAddress()`, `reflectionFee()`, `isExcludedFromReward()`, `tokenFromReflection()`
- **Router**: `0x165C3410fC91EF562C50559f7d2289fEbed552d9`

### Files to Change

**1. `src/utils/constants.ts`** — Core configuration
- Update `ARK_TOKEN` to `0xF4a370e64DD4673BAA250C5435100FA98661Db4C`
- Update `PULSEX_V2_ROUTER` to `0x165C3410fC91EF562C50559f7d2289fEbed552d9`
- Add `USDC: '0x15D38573d2feeb82e7ad5187aB8c1D52810B1f07'`
- Clear `ARK_PLS_PAIR` and `ARK_DAI_PAIR` (new pair addresses unknown yet — will need to be discovered on-chain)
- Update `ARK_TOKEN_ABI` to match new contract (remove reflection functions, add `PAIR()`, `BURN()`, `USDC()`, `ARKDAO()`, `daoFee()`, `DIVIDER()`, `MAX_TOTAL_FEE()`, `updateFees()`, `distributeLockerRewards()`, `sendDAORewards()`, `updateLiquidityPair()`, `excludedWalletFromFee()`)
- Update `CONTRACT_CONSTANTS` fees: `LIQUIDITY_FEE: 400`, `LOCKER_FEE: 400`, `BURN_FEE: 100`, `DAO_FEE: 100`, `TOTAL_FEES: 1000`, remove `REFLECTION_FEE`, add `DAO_FEE`
- Update `DEX_ROUTER_ABI` to use `WPLS()` (already correct)

**2. `src/hooks/useContractData.ts`** — Contract data fetching
- Replace `arkToken.pulseXPair()` → `arkToken.PAIR()`
- Replace `arkToken.burnAddress()` → `arkToken.BURN()`
- Add `arkToken.ARKDAO()` fetch
- Replace `reflection` fee references with `dao` in the `ContractData` interface and `STATIC_FEES`

**3. `src/services/feeCalculatorService.ts`** — Fee calculations
- Replace all `REFLECTION_FEE` references with `DAO_FEE`
- Rename `reflection` → `dao` in `FeesCollected` interface and calculations

**4. `src/components/fees/SimplifiedFeesSection.tsx`** — Fee display
- Rename "Reflection" fee card to "DAO"

**5. `supabase/functions/pulsex-graphql/index.ts`** — Subgraph query
- Update `ARK_TOKEN_ADDRESS` to new address
- Clear hardcoded `ARK_PLS_PAIR` (will be discovered)

**6. `supabase/functions/automated-rewards/index.ts`** — Rewards automation
- Update `CONTRACT_ADDRESS` to new token address
- Update ABI to match new contract functions (`distributeLockerRewards()` and `sendDAORewards()` instead of `manualSwapAndLiquify()`)

**7. `src/services/liquidityTrackingService.ts`** — No code changes needed (uses `CONTRACT_ADDRESSES.ARK_TOKEN` which auto-updates)

**8. `src/services/price/priceCalculatorService.ts`** — No code changes needed (uses constants)

### Pair Address Discovery
The ARK/PLS pair address is created at deploy time via the factory. After updating the token address, we'll add a one-time lookup in the RPC proxy or `useContractData` to call `PAIR()` on the new contract and store that address. This replaces the hardcoded `ARK_PLS_PAIR`.

