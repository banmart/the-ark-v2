import React from 'react';
import arkVessel from 'https://emerald-quickest-swallow-922.mypinata.cloud/ipfs/bafkreifc7dz6zfjtgbc5dn7ocr7rtfjwwzrurrtbmgwbi5e2e447ixa5ei';
import tokenomicsPillars from '@/assets/tokenomics-pillars.jpg';
import burnProtocol from '@/assets/burn-protocol.jpg';
import reflectionMatrix from '@/assets/reflection-matrix.jpg';
import liquidityEngine from '@/assets/liquidity-engine.jpg';
import vaultRewards from '@/assets/vault-rewards.jpg';
import immutableSecurity from '@/assets/immutable-security.jpg';

const contentSections = [
  {
    heading: "ARK: Your Vessel Through the Storm",
    paragraph: "In volatile markets, stability is rare. ARK's deflationary design, security-focused contract, and automated rewards keep you afloat while others sink.",
    image: arkVessel,
    imageDescription: "A massive futuristic ark ship cutting through stormy digital waves, glowing with blue quantum light."
  },
  {
    heading: "Tokenomics That Pull Their Weight",
    paragraph: "Every transaction feeds the ecosystem: 2% Burn, 2% Reflection, 3% Liquidity, 2% Locker. Nothing wasted, everything working for holders.",
    image: tokenomicsPillars,
    imageDescription: "Four glowing energy pillars connected to a central crystal core, each labeled with the fee percentages."
  },
  {
    heading: "Burn Protocol: Permanent Supply Cut",
    paragraph: "2% of every trade vanishes into the void. Pair it with LP token burns, and supply tightens over time—driving long-term scarcity.",
    image: burnProtocol,
    imageDescription: "Tokens disintegrating into bright sparks, vanishing into a black void with no return."
  },
  {
    heading: "Reflection Matrix: Hold, Earn, Repeat",
    paragraph: "Holders passively earn from every transaction. Your share grows automatically, rewarding patience without extra steps.",
    image: reflectionMatrix,
    imageDescription: "Golden streams of light branching out from a central sphere to countless glowing wallets."
  },
  {
    heading: "Liquidity Engine: Market Stability On Autopilot",
    paragraph: "3% of each transaction feeds liquidity. This keeps trading smooth and price swings tamer, even in rough waters.",
    image: liquidityEngine,
    imageDescription: "A futuristic engine surrounded by circulating blue liquid energy, balancing two glowing scales."
  },
  {
    heading: "Vault Rewards: The Longer You Lock, The Greater the Treasure",
    paragraph: "Lock your ARK tokens to climb reward tiers. From Bronze to Legendary, time commitment multiplies your returns.",
    image: vaultRewards,
    imageDescription: "A glowing vault door opening to reveal stacked treasure chests labeled with tier names."
  },
  {
    heading: "Immutable, Autonomous, Secure",
    paragraph: "Fees and mechanics are hard-coded. No one—owner included—can alter the rules. Automated systems ensure fairness for all.",
    image: immutableSecurity,
    imageDescription: "A quantum core surrounded by floating code locks and unbreakable chains."
  }
];

const ContentSections = () => {
  return (
    <div className="relative z-10 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {contentSections.map((section, index) => (
          <div 
            key={index}
            className={`mb-32 last:mb-0 animate-fade-in`}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className={`grid lg:grid-cols-2 gap-12 items-center ${
              index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
            }`}>
              {/* Image */}
              <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-60"></div>
                  <img
                    src={section.image}
                    alt={section.imageDescription}
                    className="relative z-10 w-full h-80 lg:h-96 object-cover rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Content */}
              <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="space-y-6">
                  <h3 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight">
                    {section.heading}
                  </h3>
                  <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                    {section.paragraph}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentSections;