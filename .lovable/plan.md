

## Add DAO Governance Page

### Overview
Create a new `/dao` page that reads from the ARKDAO contract at `0x52433bc0bbAd24ba29c1Efc299C4F1A86BDE2582`. Add a "DAO" link in both desktop and mobile navigation.

### Contract Summary
- **Only top lockers** (from ARKLocker) can create proposals and vote
- Proposals have a title, description, optional USDC fund request, and 7-30 day voting duration
- Fund requests capped at 20% of contract's USDC balance
- Quorum: 15 voters; passes if votesFor > votesAgainst
- Proposers can claim USDC from succeeded proposals
- Key read functions: `totalProposals`, `getProposals(uint256[])`, `getVotersForProposals(uint256[])`, `getVoteReceipt(proposalID, voter)`, `proposalState(proposalID)`
- Key write functions: `createProposal(title, description, requestedFund, duration)`, `castVote(proposalID, support)`, `claimFund(proposalID)`

### Files to create/edit

**1. `src/utils/constants.ts`** — Add DAO contract address and ABI
- Add `DAO_ADDRESS = '0x52433bc0bbAd24ba29c1Efc299C4F1A86BDE2582'` to `CONTRACT_ADDRESSES`
- Add `ARKDAO_ABI` covering all view/write functions and events

**2. `src/hooks/useDAOData.ts`** — New hook
- Read `totalProposals`, then batch-fetch proposals via `getProposals([1..n])`
- Read USDC balance of DAO contract for available treasury
- Check `isTopLocker(account)` via ARKLocker to determine if user can propose/vote
- `getVoteReceipt` for connected user on each proposal
- Expose `createProposal`, `castVote`, `claimFund` write actions
- Return: proposals list, treasury balance, isTopLocker flag, loading state

**3. `src/pages/DAO.tsx`** — New page
- Use `BaseLayout` wrapper (same as Locker page pattern)
- **Header**: DAO title, treasury balance (USDC), contract address display
- **Proposal list**: Cards showing title, description, status (Active/Succeeded/Defeated), vote counts, time remaining, requested funds
- **Create proposal form** (visible only to top lockers): title, description, fund amount, duration slider (7-30 days)
- **Vote UI** on active proposals (for top lockers): For/Against buttons, show user's existing vote
- **Claim button** on succeeded proposals for the proposer

**4. `src/App.tsx`** — Add route
- Import DAO page, add `<Route path="/dao" element={<DAO />} />`

**5. `src/components/Navigation.tsx`** — Add "DAO" link
- Add a "DAO" nav link between "Locker" and the Connect Wallet button (line ~243), matching existing link styling

**6. `src/components/MobileMenu.tsx`** — Add "DAO" link card
- Add a DAO card after the Locker card (line ~259), matching existing card pattern

