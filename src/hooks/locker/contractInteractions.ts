
import { ethers } from 'ethers';
import { ARK_TOKEN_ABI, LOCKER_VAULT_ABI, CONTRACT_ADDRESSES, LOCKER_VAULT_ADDRESS, NETWORKS } from '../../utils/constants';
import { ContractConstants, DEFAULT_CONSTANTS } from './lockTiers';

export const fetchContractConstants = async (): Promise<ContractConstants> => {
  try {
    console.log('Fetching enhanced contract constants...');
    const rpcProvider = new ethers.JsonRpcProvider(NETWORKS.PULSECHAIN.rpcUrls[0]);
    const contract = new ethers.Contract(LOCKER_VAULT_ADDRESS, LOCKER_VAULT_ABI, rpcProvider);
    
    const [minDuration, maxDuration, basisPoints, maxEarlyPenalty, earlyPenalty, burnShare, rewardShare] = await Promise.all([
      contract.MIN_LOCK_DURATION(),
      contract.MAX_LOCK_DURATION(),
      contract.BASIS_POINTS(),
      contract.MAX_EARLY_PENALTY(),
      contract.earlyUnlockPenalty(),
      contract.penaltyBurnShare(),
      contract.penaltyRewardShare()
    ]);

    const minDurationDays = Math.ceil(parseInt(minDuration.toString()) / (24 * 60 * 60));
    const maxDurationDays = Math.ceil(parseInt(maxDuration.toString()) / (24 * 60 * 60));
    
    const constants = {
      MIN_LOCK_DURATION: minDurationDays,
      MAX_LOCK_DURATION: maxDurationDays,
      BASIS_POINTS: parseInt(basisPoints.toString()),
      EARLY_UNLOCK_PENALTY: parseInt(earlyPenalty.toString()),
      MAX_EARLY_PENALTY: parseInt(maxEarlyPenalty.toString()),
      PENALTY_BURN_SHARE: parseInt(burnShare.toString()),
      PENALTY_REWARD_SHARE: parseInt(rewardShare.toString())
    };

    console.log('Enhanced contract constants fetched:', constants);
    return constants;
    
  } catch (error) {
    console.error('Failed to fetch contract constants, using defaults:', error);
    return DEFAULT_CONSTANTS;
  }
};

export const fetchUserTokenData = async (account: string, provider: any) => {
  try {
    const arkContract = new ethers.Contract(CONTRACT_ADDRESSES.ARK_TOKEN, ARK_TOKEN_ABI, provider);
    
    const [balance, allowance] = await Promise.all([
      arkContract.balanceOf(account),
      arkContract.allowance(account, LOCKER_VAULT_ADDRESS)
    ]);

    return {
      balance: parseFloat(ethers.formatEther(balance)),
      allowance: parseFloat(ethers.formatEther(allowance))
    };
  } catch (error) {
    console.error('Error fetching user token data:', error);
    return { balance: 0, allowance: 0 };
  }
};

export const calculatePenaltyPreview = async (
  userAddress: string,
  lockId: number,
  provider: any
): Promise<{ penaltyAmount: number; userReceives: number; penaltyRate: number } | null> => {
  try {
    const lockerContract = new ethers.Contract(LOCKER_VAULT_ADDRESS, LOCKER_VAULT_ABI, provider);
    
    const [penaltyAmount, userReceives] = await lockerContract.calculateEarlyUnlockPenalty(userAddress, lockId);
    
    const penalty = parseFloat(ethers.formatEther(penaltyAmount));
    const receives = parseFloat(ethers.formatEther(userReceives));
    const totalAmount = penalty + receives;
    const penaltyRate = totalAmount > 0 ? (penalty / totalAmount) * 100 : 0;

    return {
      penaltyAmount: penalty,
      userReceives: receives,
      penaltyRate
    };
  } catch (error) {
    console.error('Error calculating penalty preview:', error);
    return null;
  }
};

export const approveTokens = async (amount: number, signer: any): Promise<boolean> => {
  console.log(`Approving ${amount} ARK tokens for locker contract...`);
  
  const arkContract = new ethers.Contract(CONTRACT_ADDRESSES.ARK_TOKEN, ARK_TOKEN_ABI, signer);
  const amountWei = ethers.parseEther(amount.toString());
  
  const tx = await arkContract.approve(LOCKER_VAULT_ADDRESS, amountWei);
  console.log('Approval transaction sent:', tx.hash);
  
  const receipt = await tx.wait();
  console.log('Approval confirmed:', receipt);
  
  return true;
};

export const lockTokensOnContract = async (
  amount: number, 
  duration: number, 
  signer: any,
  CONTRACT_CONSTANTS: ContractConstants
): Promise<void> => {
  console.log(`Locking ${amount} ARK tokens for ${duration} days...`);
  
  const lockerContract = new ethers.Contract(LOCKER_VAULT_ADDRESS, LOCKER_VAULT_ABI, signer);
  const amountWei = ethers.parseEther(amount.toString());
  const durationSeconds = Math.floor(duration * 24 * 60 * 60);
  
  console.log('Contract call params:', {
    amount: amount.toString(),
    amountWei: amountWei.toString(),
    duration,
    durationSeconds,
    minAllowed: CONTRACT_CONSTANTS.MIN_LOCK_DURATION,
    maxAllowed: CONTRACT_CONSTANTS.MAX_LOCK_DURATION,
    contractAddress: LOCKER_VAULT_ADDRESS
  });
  
  const tx = await lockerContract.lockTokens(amountWei, durationSeconds);
  console.log('Lock transaction sent:', tx.hash);
  
  const receipt = await tx.wait();
  console.log('Lock confirmed:', receipt);
};

export const unlockTokensOnContract = async (lockId: number, signer: any): Promise<void> => {
  console.log(`Unlocking position ${lockId}...`);
  
  const lockerContract = new ethers.Contract(LOCKER_VAULT_ADDRESS, LOCKER_VAULT_ABI, signer);
  const tx = await lockerContract.unlockTokens(lockId);
  console.log('Unlock transaction sent:', tx.hash);
  
  const receipt = await tx.wait();
  console.log('Unlock confirmed:', receipt);
};

export const claimRewardsOnContract = async (signer: any): Promise<void> => {
  console.log('Claiming rewards...');
  
  const lockerContract = new ethers.Contract(LOCKER_VAULT_ADDRESS, LOCKER_VAULT_ABI, signer);
  const tx = await lockerContract.claimRewards();
  console.log('Claim transaction sent:', tx.hash);
  
  const receipt = await tx.wait();
  console.log('Claim confirmed:', receipt);
};
