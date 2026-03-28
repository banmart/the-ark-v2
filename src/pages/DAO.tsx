import React, { useState } from 'react';
import BaseLayout from '@/components/layout/BaseLayout';
import { useDAOData, ProposalView } from '@/hooks/useDAOData';
import { useWalletContext } from '@/components/providers/WalletProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { CONTRACT_ADDRESSES } from '@/utils/constants';
import { ethers } from 'ethers';
import {
  Vote,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  DollarSign,
  Users,
  Loader2,
  Copy,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Banknote,
  Shield,
} from 'lucide-react';

const USDC_DECIMALS = 6;

const stateLabels: Record<number, string> = { 0: 'Active', 1: 'Defeated', 2: 'Succeeded' };
const stateColors: Record<number, string> = {
  0: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
  1: 'bg-red-500/20 text-red-400 border-red-500/40',
  2: 'bg-green-500/20 text-green-400 border-green-500/40',
};

function formatUSDC(raw: bigint): string {
  return parseFloat(ethers.formatUnits(raw, USDC_DECIMALS)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function timeRemaining(endTimestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = endTimestamp - now;
  if (diff <= 0) return 'Ended';
  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  if (days > 0) return `${days}d ${hours}h remaining`;
  const mins = Math.floor((diff % 3600) / 60);
  return `${hours}h ${mins}m remaining`;
}

const DAO = () => {
  const { account, isConnected } = useWalletContext();
  const {
    proposals, totalProposals, treasuryBalance, isTopLocker,
    userVotes, loading, actionLoading, createProposal, castVote, claimFund,
  } = useDAOData(account);

  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fundAmount, setFundAmount] = useState('');
  const [durationDays, setDurationDays] = useState(14);

  const handleCreate = async () => {
    if (!title.trim() || !description.trim()) return;
    await createProposal(title.trim(), description.trim(), fundAmount, durationDays);
    setTitle('');
    setDescription('');
    setFundAmount('');
    setDurationDays(14);
    setShowCreate(false);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESSES.DAO);
  };

  return (
    <BaseLayout>
      <div className="max-w-5xl mx-auto px-4 pb-20 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16 px-4">
          <div className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10">
            <Shield className="w-4 h-4 text-white/40" />
            <span className="text-white/40 font-mono text-[10px] tracking-[0.3em] uppercase">Executive Governance</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-8 bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent tracking-tighter uppercase font-sans">
            THE COUNCIL CHAMBER
          </h1>
          <div className="w-48 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-8" />
          <p className="text-white/50 text-base md:text-xl max-w-3xl mx-auto font-mono leading-relaxed uppercase tracking-tighter italic">
            Governance by the high Keepers of the Statutes. Deliberate on the evolution of the Covenant and administer the Ark Treasury.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="relative liquid-glass rounded-2xl border border-white/10 p-6 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                <Banknote className="w-5 h-5 text-white/60" />
              </div>
              <div>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Treasury</p>
                <p className="text-xl font-black text-white font-mono">${treasuryBalance} <span className="text-[10px] text-white/20">USDC</span></p>
              </div>
            </div>
          </div>

          <div className="relative liquid-glass rounded-2xl border border-white/10 p-6 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                <Vote className="w-5 h-5 text-white/60" />
              </div>
              <div>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Decrees</p>
                <p className="text-xl font-black text-white font-mono">{totalProposals}</p>
              </div>
            </div>
          </div>

          <div className="relative liquid-glass rounded-2xl border border-white/10 p-6 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                <Users className="w-5 h-5 text-white/60" />
              </div>
              <div>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Your Status</p>
                <p className="text-[10px] font-black text-white font-mono uppercase tracking-widest">
                  {!isConnected ? 'Disconnected' : isTopLocker ? 'Council Member' : 'Initiate'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contract Address */}
        <div className="flex items-center gap-2 text-xs font-mono text-white/30">
          <span>Contract:</span>
          <span className="text-white/50">{CONTRACT_ADDRESSES.DAO}</span>
          <button onClick={copyAddress} className="hover:text-cyan-400 transition-colors"><Copy className="w-3 h-3" /></button>
          <a href={`https://scan.pulsechain.com/address/${CONTRACT_ADDRESSES.DAO}`} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Create Proposal */}
        {isConnected && isTopLocker && (
          <div>
            {!showCreate ? (
              <Button
                onClick={() => setShowCreate(true)}
                className="bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-mono font-bold hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-2" /> New Proposal
              </Button>
            ) : (
              <Card className="liquid-glass border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-lg font-mono text-cyan-400">Create Proposal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Proposal title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-white/[0.05] border-white/[0.1]"
                  />
                  <Textarea
                    placeholder="Describe your proposal..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-white/[0.05] border-white/[0.1] min-h-[100px]"
                  />
                  <div>
                    <label className="text-xs font-mono text-white/40 uppercase tracking-wider mb-2 block">
                      USDC Fund Request (optional)
                    </label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={fundAmount}
                      onChange={(e) => setFundAmount(e.target.value)}
                      className="bg-white/[0.05] border-white/[0.1]"
                    />
                    <p className="text-[10px] text-white/30 mt-1 font-mono">Max 20% of treasury ({(parseFloat(treasuryBalance) * 0.2).toFixed(2)} USDC)</p>
                  </div>
                  <div>
                    <label className="text-xs font-mono text-white/40 uppercase tracking-wider mb-2 block">
                      Duration: {durationDays} days
                    </label>
                    <Slider
                      value={[durationDays]}
                      onValueChange={(v) => setDurationDays(v[0])}
                      min={7}
                      max={30}
                      step={1}
                    />
                    <div className="flex justify-between text-[10px] text-white/30 font-mono mt-1">
                      <span>7 days</span>
                      <span>30 days</span>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={handleCreate}
                      disabled={actionLoading || !title.trim() || !description.trim()}
                      className="bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-mono font-bold hover:opacity-90"
                    >
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Submit
                    </Button>
                    <Button variant="outline" onClick={() => setShowCreate(false)} className="border-white/[0.1] text-white/60 font-mono">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Proposals List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        ) : proposals.length === 0 ? (
          <Card className="liquid-glass border-white/[0.08]">
            <CardContent className="p-12 text-center">
              <Vote className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/40 font-mono">No proposals yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {proposals.map((p) => (
              <ProposalCard
                key={p.proposalID}
                proposal={p}
                userVote={userVotes[p.proposalID]}
                isTopLocker={isTopLocker}
                isConnected={isConnected}
                account={account}
                actionLoading={actionLoading}
                onVote={castVote}
                onClaim={claimFund}
              />
            ))}
          </div>
        )}
      </div>
    </BaseLayout>
  );
};

interface ProposalCardProps {
  proposal: ProposalView;
  userVote?: { hasVoted: boolean; support: number };
  isTopLocker: boolean;
  isConnected: boolean;
  account: string | null;
  actionLoading: boolean;
  onVote: (id: number, support: number) => Promise<void>;
  onClaim: (id: number) => Promise<void>;
}

const ProposalCard = ({ proposal, userVote, isTopLocker, isConnected, account, actionLoading, onVote, onClaim }: ProposalCardProps) => {
  const p = proposal;
  const totalVotes = p.votesFor + p.votesAgainst;
  const forPct = totalVotes > 0 ? (p.votesFor / totalVotes) * 100 : 0;
  const isProposer = account?.toLowerCase() === p.proposer.toLowerCase();
  const claimable = p.state === 2 && isProposer && !p.fundsClaimed && p.requestedFund > 0n;

  return (
    <div className="relative liquid-glass rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300">
      <div className="p-5 md:p-8 space-y-5 md:space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[9px] md:text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">DECREE #{p.proposalID}</span>
              <span className={`text-[9px] md:text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                p.state === 0 ? 'border-white/30 text-white/80' : 
                p.state === 1 ? 'border-red-500/20 text-red-400' : 'border-green-500/20 text-green-400'
              }`}>
                {stateLabels[p.state].toUpperCase()}
              </span>
            </div>
            {p.requestedFund > 0n && (
              <div className="text-right">
                <p className="text-[10px] font-black text-white font-mono">${formatUSDC(p.requestedFund)}</p>
              </div>
            )}
          </div>
          
          <h3 className="text-lg md:text-xl font-black text-white leading-tight uppercase tracking-tighter font-sans">{p.title}</h3>
          
          {p.state === 0 && (
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-white/30 uppercase tracking-widest">
              <Clock className="w-3 h-3" /> {timeRemaining(p.votingEnd)}
            </div>
          )}
        </div>

        {/* Description - Compact on mobile */}
        <p className="text-xs md:text-sm text-white/50 leading-relaxed font-mono line-clamp-3 md:line-clamp-none">
          {p.description}
        </p>

        {/* Indicators Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <p className="text-[8px] md:text-[9px] font-mono text-white/20 uppercase tracking-[0.3em]">
            ORIGIN: {p.proposer.slice(0, 6)}...{p.proposer.slice(-4)}
          </p>
          
          <div className="flex items-center gap-4 text-[9px] font-mono uppercase tracking-widest">
             <span className="text-white/40 flex items-center gap-1"><Users className="w-3 h-3" /> {p.voterCount}/15 QUORUM</span>
          </div>
        </div>

        {/* Progress System */}
        <div className="space-y-2">
          <div className="flex justify-between text-[9px] font-mono uppercase tracking-widest px-1">
            <span className="text-emerald-400 flex items-center gap-1"><ThumbsUp className="w-2.5 h-2.5" /> {p.votesFor}</span>
            <span className="text-red-400 flex items-center gap-1">{p.votesAgainst} <ThumbsDown className="w-2.5 h-2.5" /></span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            {totalVotes > 0 && (
              <div
                className="h-full bg-white transition-all duration-700 shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                style={{ width: `${forPct}%` }}
              />
            )}
          </div>
        </div>

        {/* Actions - Mobile Optimized Buttons */}
        <div className="flex items-center gap-3 pt-2">
          {p.state === 0 && isConnected && isTopLocker && !userVote?.hasVoted && (
            <>
              <button
                onClick={() => onVote(p.proposalID, 1)}
                disabled={actionLoading}
                className="flex-1 py-3 bg-white text-black font-black font-mono text-[10px] uppercase hover:scale-[1.02] transition-all"
              >
                In Favor
              </button>
              <button
                onClick={() => onVote(p.proposalID, 0)}
                disabled={actionLoading}
                className="flex-1 py-3 bg-white/5 border border-white/10 text-white font-black font-mono text-[10px] uppercase hover:bg-white/10 transition-all"
              >
                Opposition
              </button>
            </>
          )}
          {userVote?.hasVoted && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">
                {userVote.support === 1 ? 'Aligned' : 'Opposed'}
              </span>
            </div>
          )}
          {claimable && (
            <button
              onClick={() => onClaim(p.proposalID)}
              disabled={actionLoading}
              className="w-full py-4 bg-white text-black font-black font-mono text-[10px] uppercase hover:scale-[1.02] transition-all"
            >
              Exert Claim
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DAO;
