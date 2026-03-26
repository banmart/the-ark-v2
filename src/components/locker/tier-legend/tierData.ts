
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
    name: 'OUTCAST',
    icon: '🌑',
    color: 'white',
    multiplier: '1x',
    duration: '< 30d',
    description: 'Unbound and unshielded',
    details: {
      rewards: 'Base ritual share',
      community: 'Unverified status',
      features: 'No flood protection',
      governance: 'No voice'
    }
  },
  {
    name: 'INITIATE',
    icon: '📜',
    color: 'white',
    multiplier: '1.2x',
    duration: '30-89d',
    description: 'First seal bound',
    details: {
      rewards: '1.2x ritual multiplier',
      community: 'Initial covenant role',
      features: 'First-layer protection',
      governance: 'Observer status'
    }
  },
  {
    name: 'ACOLYTE',
    icon: '🕯️',
    color: 'white',
    multiplier: '2x',
    duration: '90-364d',
    description: 'Devoted to the creed',
    details: {
      rewards: '2x ritual multiplier',
      community: 'Acolyte privileges',
      features: 'Standard vault access',
      governance: 'Limited voting rights'
    }
  },
  {
    name: 'WARDEN',
    icon: '🛡️',
    color: 'white',
    multiplier: '3.5x',
    duration: '1-2y',
    description: 'Statute defender',
    details: {
      rewards: '3.5x ritual multiplier',
      community: 'Warden status',
      features: 'Exclusive vault access',
      governance: 'Full voting rights'
    }
  },
  {
    name: 'SENTINEL',
    icon: '⚔️',
    color: 'white',
    multiplier: '5.5x',
    duration: '2-4y',
    description: 'Inner circle protector',
    details: {
      rewards: '5.5x ritual multiplier',
      community: 'Sentinel elite status',
      features: 'Council communication',
      governance: 'Proposal creation'
    }
  },
  {
    name: 'ARCH-KEEPER',
    icon: '⚜️',
    color: 'white',
    multiplier: '10x',
    duration: '5y+',
    description: 'Supreme custodian',
    special: true,
    details: {
      rewards: '10x ritual multiplier',
      community: 'Supreme inner circle',
      features: 'Ultimate vault protection',
      governance: 'Council leadership'
    }
  }
];
