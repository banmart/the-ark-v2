
interface TierDetails {
  rewards: string;
  community: string;
  features: string;
  governance: string;
}

export interface Tier {
  name: string;
  icon: string;
  color: string;
  multiplier: string;
  duration: string;
  description: string;
  details: TierDetails;
  special?: boolean;
}

export const tiers: Tier[] = [
  {
    name: 'BRONZE',
    icon: '🥉',
    color: 'white',
    multiplier: '1.0x',
    duration: '30d',
    description: 'Protocol Entry Tier',
    details: {
      rewards: 'Base Yield Multiplier',
      community: 'Standard Governance Status',
      features: 'Protocol Protection Phase 1',
      governance: 'Limited Voting Weight'
    }
  },
  {
    name: 'SILVER',
    icon: '🥈',
    color: 'white',
    multiplier: '1.5x',
    duration: '90d',
    description: 'Elevated Yield Participation',
    details: {
      rewards: '1.5x Yield Multiplier',
      community: 'Established Governance Status',
      features: 'Enhanced Reward Pool Access',
      governance: 'Full Voter Eligibility'
    }
  },
  {
    name: 'GOLD',
    icon: '🥇',
    color: 'white',
    multiplier: '2.0x',
    duration: '180d',
    description: 'Strategic Lock Maturity',
    details: {
      rewards: '2.0x Yield Multiplier',
      community: 'Core Contributor Status',
      features: 'Priority Reward Distribution',
      governance: 'Standard Proposal Voting'
    }
  },
  {
    name: 'DIAMOND',
    icon: '💎',
    color: 'white',
    multiplier: '3.0x',
    duration: '1 Year',
    description: 'High-Efficiency Liquidity',
    details: {
      rewards: '3.0x Yield Multiplier',
      community: 'Premium Locker Status',
      features: 'VIP Incentive Access',
      governance: 'Advanced Governance Weight'
    }
  },
  {
    name: 'PLATINUM',
    icon: '⭐',
    color: 'white',
    multiplier: '4.0x',
    duration: '2 Years',
    description: 'Elite Capital Alignment',
    details: {
      rewards: '4.0x Yield Multiplier',
      community: 'Protocol Elite Role',
      features: 'Maximum Reward Depth',
      governance: 'Strategic Influence Access'
    }
  },
  {
    name: 'MYTHIC',
    icon: '🔮',
    color: 'white',
    multiplier: '5.0x',
    duration: '3 Years',
    description: 'Maximum Protocol Synergies',
    details: {
      rewards: '5.0x Yield Multiplier',
      community: 'Director Level Influence',
      features: 'Ultimate Reward Tiers',
      governance: 'Council Level Voting weight'
    }
  },
  {
    name: 'LEGENDARY',
    icon: '⚡',
    color: 'gold',
    multiplier: '7.0x',
    duration: '4 Years',
    description: 'Total Protocol Integration',
    special: true,
    details: {
      rewards: '7.0x Yield Multiplier',
      community: 'Infinite Legend Tier',
      features: 'Total Yield Supremacy',
      governance: 'Core Protocol Steering Power'
    }
  }
];
