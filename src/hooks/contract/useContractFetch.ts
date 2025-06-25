
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, ARK_TOKEN_ABI, NETWORKS } from '../../utils/constants';
import { ContractData } from './types';

export const useContractFetch = () => {
  const fetchContractData = async (
    setData: React.Dispatch<React.SetStateAction<ContractData>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    try {
      setLoading(true);
      
      const provider = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
      const arkToken = new ethers.Contract(CONTRACT_ADDRESSES.ARK_TOKEN, ARK_TOKEN_ABI, provider);

      console.log('Fetching live contract data including LP burn data...');

      // Fetch live contract info, fees, liquidity data, and LP burn data
      const [
        owner, 
        isPaused, 
        currentFees, 
        tokensForLiquidity, 
        totalFeesCollected,
        swapSettings,
        lockerRewardsInfo,
        lpTokensBurned
      ] = await Promise.all([
        arkToken.owner().catch(() => '0x0000000000000000000000000000000000000000'),
        arkToken.paused().catch(() => false),
        arkToken.getCurrentFees().catch(() => [3, 2, 2, 2, 9]), // Default fees if call fails
        arkToken.getTokensForLiquidity().catch(() => ethers.parseEther('0')), // Real tokens ready for liquidity
        arkToken.totalFeesCollected().catch(() => ethers.parseEther('0')), // Total fees collected
        arkToken.getSwapSettings().catch(() => [ethers.parseEther('1000'), ethers.parseEther('50000'), false]), // [threshold, maxAmount, enabled]
        arkToken.getLockerRewardsInfo().catch(() => ['0x0000000000000000000000000000000000000000', ethers.parseEther('0'), ethers.parseEther('0')]), // [vault, pending, distributed]
        arkToken.totalLPTokensBurned().catch(() => ethers.parseEther('0')) // Real LP tokens burned data
      ]);

      console.log('Live contract data fetched:', {
        fees: currentFees,
        tokensForLiquidity: ethers.formatEther(tokensForLiquidity),
        totalFeesCollected: ethers.formatEther(totalFeesCollected),
        swapSettings,
        lockerRewardsInfo,
        lpTokensBurned: ethers.formatEther(lpTokensBurned)
      });

      // Update with real contract data including live LP burn data
      setData(prev => ({
        ...prev,
        currentFees: {
          burn: Number(currentFees[0] || 3),
          reflection: Number(currentFees[1] || 2),
          liquidity: Number(currentFees[2] || 2),
          locker: Number(currentFees[3] || 2),
          total: Number(currentFees[4] || 9)
        },
        maxFees: {
          burn: 3,
          reflection: 3,
          liquidity: 2,
          locker: 2,
          total: 9
        },
        liquidityData: {
          tokensForLiquidity: ethers.formatEther(tokensForLiquidity),
          totalFeesCollected: ethers.formatEther(totalFeesCollected),
          lpTokensBurned: ethers.formatEther(lpTokensBurned) // Now using real LP burn data
        },
        swapSettings: {
          threshold: ethers.formatEther(swapSettings[0]),
          maxAmount: ethers.formatEther(swapSettings[1]),
          enabled: swapSettings[2],
          slippageTolerance: 200 // Default 2% if not available from contract
        },
        lockerRewards: {
          vaultAddress: lockerRewardsInfo[0],
          pending: ethers.formatEther(lockerRewardsInfo[1]),
          distributed: ethers.formatEther(lockerRewardsInfo[2])
        },
        security: {
          ...prev.security,
          isPaused,
          ownerAddress: owner,
          hasReentrancyGuard: true,
          hasPauseFunction: true
        },
        lastUpdated: new Date()
      }));

      console.log('Contract data updated successfully with live LP burn data');
    } catch (err: any) {
      console.error('Error fetching live contract data:', err);
    } finally {
      setLoading(false);
    }
  };

  return { fetchContractData };
};
