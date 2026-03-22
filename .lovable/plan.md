

## Fix Tier Legend Layout + Replace Duration Slider with Tier Presets

### 1. Fix CompactTierDisplay grid to show all 7 tiers in one row

**File**: `src/components/locker/CompactTierDisplay.tsx`

- Change grid from `grid-cols-2 sm:grid-cols-3 md:grid-cols-6` to `grid-cols-3 sm:grid-cols-4 md:grid-cols-7`
- Also fix `activeTier` modulo from `% 6` to `% 7` (now 7 tiers)
- Add `'MYTHIC': '139, 92, 246'` to the `getTierColorRGB` map (currently missing, falls back to cyan)

### 2. Replace LockDurationSlider with tier preset buttons

**File**: `src/components/locker/LockDurationSlider.tsx`

Replace the days slider with a row of 7 tier buttons showing the tier name, icon, multiplier, and duration range. Clicking a tier sets `lockDuration` to that tier's `minDays`. Each button highlights when the current `lockDuration` falls within its range.

Tier presets from `lockTiers.ts`:
- Bronze: 30-89d → "1-3 months"
- Silver: 90-179d → "3-6 months"  
- Gold: 180-364d → "6-12 months"
- Diamond: 365-729d → "1-2 years"
- Platinum: 730-1094d → "2-3 years"
- Mythic: 1095-1459d → "3-4 years"
- Legendary: 1460-1826d → "4-5 years"

Display as a responsive grid of selectable cards (not a slider). Each card shows the tier icon, name, multiplier, and human-readable period. The selected tier gets a highlighted border matching its color.

