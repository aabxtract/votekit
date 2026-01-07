'use client';

import { useReadContract } from 'wagmi';
import { Skeleton } from '@/components/ui/skeleton';
import { ProposalCard } from './proposal-card';
import { contractAddress, voterKitABI } from '@/lib/config';
import { DemoProposalCard } from './demo-proposal-card';

const demoProposals = [
  {
    id: BigInt(999),
    question: 'Should we launch a new marketing campaign for Q3?',
    options: ['Yes, focus on social media', 'Yes, focus on content marketing', 'No, allocate budget elsewhere'],
    endTime: BigInt(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3), // 3 days from now
    isVotingClosed: false,
    tags: ['Marketing', 'Budget'],
  },
  {
    id: BigInt(998),
    question: 'Update the community logo?',
    options: ['Keep the current logo', 'Commission a new design', 'Hold a design contest'],
    endTime: BigInt(Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 2), // 2 days ago
    isVotingClosed: true,
    tags: ['Branding', 'Design'],
  }
];

export function ProposalList() {
  const { data: proposalCount, isLoading, isError, isRefetching } = useReadContract({
    address: contractAddress,
    abi: voterKitABI,
    functionName: 'proposalCount',
    query: {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  });

  // Only show the main loading skeleton on the initial load.
  if (isLoading && !isRefetching) {
    return (
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-96 rounded-xl" />
        ))}
      </div>
    );
  }

  // If there's an error fetching or the blockchain has no proposals, show the demo ones.
  if (isError || !proposalCount || Number(proposalCount) === 0) {
    return (
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
         {demoProposals.map((proposal) => (
           <DemoProposalCard key={proposal.id.toString()} proposal={proposal} />
         ))}
      </div>
    );
  }

  const count = Number(proposalCount);
  
  // Create an array of IDs from count-1 down to 0 to show newest first.
  const proposalIds = Array.from({ length: count }, (_, i) => count - 1 - i);

  return (
    <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {proposalIds.map((id) => (
        <ProposalCard key={id} proposalId={BigInt(id)} />
      ))}
    </div>
  );
}
