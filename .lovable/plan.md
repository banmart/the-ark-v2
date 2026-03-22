

## Update Token Address & Burn Page

### 1. Replace old token address with new one

The old address `0x403e7D1F5AaD720f56a49B82e4914D7Fd3AaaE67` appears in 3 files:

**`src/components/Footer.tsx`** (lines 240, 252, 316)
- Update contract explorer link, PulseX swap link, and displayed contract address pill to `0xF4a370e64DD4673BAA250C5435100FA98661Db4C`

**`src/components/layout/PageLayout.tsx`** (line 27)
- Update `CONTRACT_ADDRESS` constant

**`src/pages/Onboarding.tsx`** (lines 158, 178)
- Update PulseX buy link and add liquidity link

### 2. Fix Burn page mechanics to match new contract

**`src/pages/Burn.tsx`** (lines 568-591)
- "Transaction Burns" description: change "2%" → "1%" (burn fee is now 1%)
- "Liquidity Burns" description: change "3% goes to liquidity" → "4% goes to liquidity"
- Update progress bar widths to reflect new proportions (burn 10%, liquidity 40%)

