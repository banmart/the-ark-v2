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
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl michroma-regular text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.3)]">
            ARK DAO
          </h1>
          <p className="text-white/60 font-mono text-sm max-w-2xl">
            Governance by the top lockers. Create proposals, vote on community direction, and request treasury funding.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-white/[0.03] border-white/[0.08] backdrop-blur-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs font-mono text-white/40 uppercase tracking-wider">Treasury</p>
                <p className="text-xl font-bold text-white">${treasuryBalance} <span className="text-xs text-white/40">USDC</span></p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.03] border-white/[0.08] backdrop-blur-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <Vote className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-xs font-mono text-white/40 uppercase tracking-wider">Proposals</p>
                <p className="text-xl font-bold text-white">{totalProposals}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.03] border-white/[0.08] backdrop-blur-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <Shield className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs font-mono text-white/40 uppercase tracking-wider">Your Status</p>
                <p className="text-sm font-bold text-white">
                  {!isConnected ? 'Not Connected' : isTopLocker ? '✓ Top Locker' : 'Not Eligible'}
                </p>
              </div>
            </CardContent>
          </Card>
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
              <Card className="bg-white/[0.03] border-cyan-500/20 backdrop-blur-sm">
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
          <Card className="bg-white/[0.03] border-white/[0.08] backdrop-blur-sm">
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
  const canClaim = p.state === 2 && isProposer && !p.fundsClaimed && p.requestedFund > 0n;

  return (
    <Card className="bg-white/[0.03] border-white/[0.08] backdrop-blur-sm hover:border-white/[0.12] transition-all duration-300">
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="text-xs font-mono text-white/30">#{p.proposalID}</span>
              <Badge variant="outline" className={`text-[10px] font-mono border ${stateColors[p.state]}`}>
                {stateLabels[p.state]}
              </Badge>
              {p.state === 0 && (
                <span className="text-[10px] font-mono text-white/30 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {timeRemaining(p.votingEnd)}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-white leading-tight">{p.title}</h3>
          </div>
          {p.requestedFund > 0n && (
            <div className="text-right shrink-0">
              <p className="text-xs font-mono text-white/30">Requested</p>
              <p className="text-sm font-bold text-green-400">${formatUSDC(p.requestedFund)}</p>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-white/50 leading-relaxed">{p.description}</p>

        {/* Proposer */}
        <p className="text-[10px] font-mono text-white/20">
          by {p.proposer.slice(0, 6)}...{p.proposer.slice(-4)}
        </p>

        {/* Vote Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-green-400 flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {p.votesFor} For</span>
            <span className="text-white/30 flex items-center gap-1"><Users className="w-3 h-3" /> {p.voterCount}/15 quorum</span>
            <span className="text-red-400 flex items-center gap-1">{p.votesAgainst} Against <ThumbsDown className="w-3 h-3" /></span>
          </div>
          <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
            {totalVotes > 0 && (
              <div
                className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500"
                style={{ width: `${forPct}%` }}
              />
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1">
          {p.state === 0 && isConnected && isTopLocker && !userVote?.hasVoted && (
            <>
              <Button
                size="sm"
                onClick={() => onVote(p.proposalID, 1)}
                disabled={actionLoading}
                className="bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 font-mono text-xs"
              >
                <ThumbsUp className="w-3 h-3 mr-1" /> Vote For
              </Button>
              <Button
                size="sm"
                onClick={() => onVote(p.proposalID, 0)}
                disabled={actionLoading}
                className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 font-mono text-xs"
              >
                <ThumbsDown className="w-3 h-3 mr-1" /> Vote Against
              </Button>
            </>
          )}
          {userVote?.hasVoted && (
            <Badge variant="outline" className="text-[10px] font-mono border-white/[0.1] text-white/40">
              {userVote.support === 1 ? '✓ Voted For' : '✓ Voted Against'}
            </Badge>
          )}
          {canClaim && (
            <Button
              size="sm"
              onClick={() => onClaim(p.proposalID)}
              disabled={actionLoading}
              className="bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-mono text-xs font-bold"
            >
              <Banknote className="w-3 h-3 mr-1" /> Claim Funds
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DAO;
