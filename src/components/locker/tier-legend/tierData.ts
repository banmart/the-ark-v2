
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
    icon: '⛵',
    color: 'yellow-600',
    multiplier: '1x',
    duration: '30-89d',
    description: 'Entry level blessing',
    details: {
      rewards: 'Base vault rewards',
      community: 'Bronze community role',
      features: 'Protected from the flood',
      governance: 'Observer status'
    }
  },
  {
    name: 'SILVER',
    icon: '🛡️',
    color: 'gray-400',
    multiplier: '1.5x',
    duration: '90-179d',
    description: 'Enhanced vault share',
    details: {
      rewards: '1.5x vault multiplier',
      community: 'Silver privileges',
      features: 'Priority support',
      governance: 'Limited voting rights'
    }
  },
  {
    name: 'GOLD',
    icon: '👑',
    color: 'yellow-400',
    multiplier: '2x',
    duration: '180-364d',
    description: 'Governance participation',
    details: {
      rewards: '2x vault multiplier',
      community: 'Gold tier status',
      features: 'Exclusive access',
      governance: 'Full voting rights'
    }
  },
  {
    name: 'DIAMOND',
    icon: '💎',
    color: 'cyan-400',
    multiplier: '3x',
    duration: '1-3y',
    description: 'VIP community access',
    details: {
      rewards: '3x vault multiplier',
      community: 'VIP community access',
      features: 'Special event invites',
      governance: 'Proposal creation rights'
    }
  },
  {
    name: 'PLATINUM',
    icon: '⭐',
    color: 'purple-400',
    multiplier: '5x',
    duration: '3-4y',
    description: 'Development influence',
    details: {
      rewards: '5x vault multiplier',
      community: 'Platinum elite status',
      features: 'Development influence',
      governance: 'Strategic decision input'
    }
  },
  {
    name: 'LEGENDARY',
    icon: '⚡',
    color: 'orange-400',
    multiplier: '8x',
    duration: '4-5y',
    description: 'True Noah privileges',
    special: true,
    details: {
      rewards: '8x vault multiplier',
      community: 'Legendary ARK status',
      features: 'Ultimate vault rewards',
      governance: 'Noah council member'
    }
  }
];
