
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
    multiplier: '1x',
    duration: '30-89d',
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
    duration: '90-179d',
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
    multiplier: '2x',
    duration: '180-364d',
    description: 'Strategic Lock Maturity',
    details: {
      rewards: '2x Yield Multiplier',
      community: 'Core Contributor Status',
      features: 'Priority Reward Distribution',
      governance: 'Standard Proposal Voting'
    }
  },
  {
    name: 'DIAMOND',
    icon: '💎',
    color: 'white',
    multiplier: '3x',
    duration: '1-2y',
    description: 'High-Efficiency Liquidity',
    details: {
      rewards: '3x Yield Multiplier',
      community: 'Premium Locker Status',
      features: 'VIP Incentive Access',
      governance: 'Advanced Governance Weight'
    }
  },
  {
    name: 'PLATINUM',
    icon: '⭐',
    color: 'white',
    multiplier: '4x',
    duration: '2-3y',
    description: 'Elite Capital Alignment',
    details: {
      rewards: '4x Yield Multiplier',
      community: 'Protocol Elite Role',
      features: 'Maximum Reward Depth',
      governance: 'Strategic Influence Access'
    }
  },
  {
    name: 'MYTHIC',
    icon: '🔮',
    color: 'white',
    multiplier: '5x',
    duration: '3-4y',
    description: 'Maximum Protocol Synergies',
    details: {
      rewards: '5x Yield Multiplier',
      community: 'Director Level Influence',
      features: 'Ultimate Reward Tiers',
      governance: 'Council Level Voting weight'
    }
  },
  {
    name: 'LEGENDARY',
    icon: '⚡',
    color: 'gold',
    multiplier: '7x',
    duration: '4-5y',
    description: 'Total Protocol Integration',
    special: true,
    details: {
      rewards: '7x Yield Multiplier',
      community: 'Infinite Legend Tier',
      features: 'Total Yield Supremacy',
      governance: 'Core Protocol Steering Power'
    }
  }
];
