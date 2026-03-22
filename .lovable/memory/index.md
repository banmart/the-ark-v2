# Memory: index.md
Updated: now

New token contract migration from old ARK to 0xF4a370e64DD4673BAA250C5435100FA98661Db4C

- Token: ARK on PulseChain
- Router: 0x165C3410fC91EF562C50559f7d2289fEbed552d9
- Fees: 4% liquidity, 4% locker, 1% burn, 1% dao (10% total)
- No reflection fee — replaced by daoFee
- Contract uses PAIR(), BURN(), USDC(), ARKDAO() immutable getters
- Pair address discovered on-chain, not hardcoded
- USDC: 0x15D38573d2feeb82e7ad5187aB8c1D52810B1f07

Locker: 0x6cA6624aEdCF03F16b29DD217447c478feC2C096 (ARKLocker)
- 7 tiers: Bronze 1x, Silver 1.5x, Gold 2x, Diamond 3x, Platinum 4x, Mythic 5x, Legendary 7x
- Uses getProtocolDashboard(), getUserDashboard(), getUserSummary(), getTopLockers()
- pendingRewardsAll() for pending rewards (not in UserStats struct)
- claimReward() not claimRewards()
- UserStats field: totalRewardEarned (not totalRewardsEarned)
- LockedPosition field: rewardEarned (not totalRewardsEarned)
- minLockAmount: 10000 ARK default
