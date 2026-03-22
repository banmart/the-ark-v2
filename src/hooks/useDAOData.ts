import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, ARKDAO_ABI, ARK_LOCKER_TOP_CHECK_ABI, NETWORKS, ARK_TOKEN_ABI } from '@/utils/constants';
import { toast } from '@/components/ui/use-toast';

export interface ProposalView {
  proposalID: number;
  title: string;
  description: string;
  requestedFund: bigint;
  claimedFund: bigint;
  votingStart: number;
  votingEnd: number;
  votesFor: number;
  votesAgainst: number;
  voterCount: number;
  fundsClaimed: boolean;
  proposer: string;
  state: number; // 0=Active, 1=Defeated, 2=Succeeded
}

export interface VoteReceipt {
  hasVoted: boolean;
  support: number;
}

export function useDAOData(account: string | null) {
  const [proposals, setProposals] = useState<ProposalView[]>([]);
  const [totalProposals, setTotalProposals] = useState(0);
  const [treasuryBalance, setTreasuryBalance] = useState<string>('0');
  const [isTopLocker, setIsTopLocker] = useState(false);
  const [userVotes, setUserVotes] = useState<Record<number, VoteReceipt>>({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const getProvider = useCallback(() => {
    return new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const provider = getProvider();
      const daoContract = new ethers.Contract(CONTRACT_ADDRESSES.DAO, ARKDAO_ABI, provider);
      const usdcContract = new ethers.Contract(CONTRACT_ADDRESSES.USDC, ['function balanceOf(address) view returns (uint256)', 'function decimals() view returns (uint8)'], provider);

      const [total, usdcBal, usdcDecimals] = await Promise.all([
        daoContract.totalProposals(),
        usdcContract.balanceOf(CONTRACT_ADDRESSES.DAO),
        usdcContract.decimals(),
      ]);

      const totalNum = Number(total);
      setTotalProposals(totalNum);
      setTreasuryBalance(ethers.formatUnits(usdcBal, usdcDecimals));

      if (totalNum > 0) {
        const ids = Array.from({ length: totalNum }, (_, i) => i + 1);
        const proposalData = await daoContract.getProposals(ids);

        const parsed: ProposalView[] = proposalData.map((p: any) => ({
          proposalID: Number(p.proposalID),
          title: p.title,
          description: p.description,
          requestedFund: p.requestedFund,
          claimedFund: p.claimedFund,
          votingStart: Number(p.votingStart),
          votingEnd: Number(p.votingEnd),
          votesFor: Number(p.votesFor),
          votesAgainst: Number(p.votesAgainst),
          voterCount: Number(p.voterCount),
          fundsClaimed: p.fundsClaimed,
          proposer: p.proposer,
          state: Number(p.state),
        }));
        setProposals(parsed.reverse());

        // Fetch user votes
        if (account) {
          const votes: Record<number, VoteReceipt> = {};
          await Promise.all(
            ids.map(async (id) => {
              try {
                const receipt = await daoContract.getVoteReceipt(id, account);
                votes[id] = { hasVoted: receipt.hasVoted, support: Number(receipt.support) };
              } catch { /* ignore */ }
            })
          );
          setUserVotes(votes);
        }
      }

      // Check top locker status
      if (account) {
        try {
          const lockerContract = new ethers.Contract(CONTRACT_ADDRESSES.LOCKER, ARK_LOCKER_TOP_CHECK_ABI, provider);
          const isTop = await lockerContract.isTopLocker(account);
          setIsTopLocker(isTop);
        } catch {
          setIsTopLocker(false);
        }
      }
    } catch (err) {
      console.error('Failed to fetch DAO data:', err);
    } finally {
      setLoading(false);
    }
  }, [account, getProvider]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getSigner = async () => {
    if (!window.ethereum) throw new Error('No wallet found');
    const provider = new ethers.BrowserProvider(window.ethereum);
    return provider.getSigner();
  };

  const createProposal = async (title: string, description: string, requestedFund: string, durationDays: number) => {
    try {
      setActionLoading(true);
      const signer = await getSigner();
      const daoContract = new ethers.Contract(CONTRACT_ADDRESSES.DAO, ARKDAO_ABI, signer);
      const usdcContract = new ethers.Contract(CONTRACT_ADDRESSES.USDC, ['function decimals() view returns (uint8)'], signer);
      const decimals = await usdcContract.decimals();

      const fundAmount = requestedFund && parseFloat(requestedFund) > 0
        ? ethers.parseUnits(requestedFund, decimals)
        : 0n;
      const durationSeconds = durationDays * 86400;

      const tx = await daoContract.createProposal(title, description, fundAmount, durationSeconds);
      toast({ title: 'Proposal Submitted', description: 'Waiting for confirmation...' });
      await tx.wait();
      toast({ title: 'Proposal Created', description: 'Your proposal is now live.' });
      await fetchData();
    } catch (err: any) {
      console.error('Create proposal error:', err);
      toast({ title: 'Error', description: err?.reason || err?.message || 'Failed to create proposal', variant: 'destructive' });
    } finally {
      setActionLoading(false);
    }
  };

  const castVote = async (proposalID: number, support: number) => {
    try {
      setActionLoading(true);
      const signer = await getSigner();
      const daoContract = new ethers.Contract(CONTRACT_ADDRESSES.DAO, ARKDAO_ABI, signer);
      const tx = await daoContract.castVote(proposalID, support);
      toast({ title: 'Vote Submitted', description: 'Waiting for confirmation...' });
      await tx.wait();
      toast({ title: 'Vote Cast', description: support === 1 ? 'Voted FOR' : 'Voted AGAINST' });
      await fetchData();
    } catch (err: any) {
      console.error('Cast vote error:', err);
      toast({ title: 'Error', description: err?.reason || err?.message || 'Failed to cast vote', variant: 'destructive' });
    } finally {
      setActionLoading(false);
    }
  };

  const claimFund = async (proposalID: number) => {
    try {
      setActionLoading(true);
      const signer = await getSigner();
      const daoContract = new ethers.Contract(CONTRACT_ADDRESSES.DAO, ARKDAO_ABI, signer);
      const tx = await daoContract.claimFund(proposalID);
      toast({ title: 'Claiming Funds', description: 'Waiting for confirmation...' });
      await tx.wait();
      toast({ title: 'Funds Claimed', description: 'USDC transferred to your wallet.' });
      await fetchData();
    } catch (err: any) {
      console.error('Claim fund error:', err);
      toast({ title: 'Error', description: err?.reason || err?.message || 'Failed to claim funds', variant: 'destructive' });
    } finally {
      setActionLoading(false);
    }
  };

  return {
    proposals,
    totalProposals,
    treasuryBalance,
    isTopLocker,
    userVotes,
    loading,
    actionLoading,
    createProposal,
    castVote,
    claimFund,
    refetch: fetchData,
  };
}
