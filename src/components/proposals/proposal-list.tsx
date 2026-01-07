'use client';

import { useReadContract } from 'wagmi';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ProposalCard } from './proposal-card';
import { contractAddress, voterKitABI } from '@/lib/config';

export function ProposalList() {
  const { data: proposalCount, isLoading, error } = useReadContract({
    address: contractAddress,
    abi: voterKitABI,
    functionName: 'proposalCount',
    query: {
      refetchInterval: 10000, // Refetch every 10 seconds
    }
  });

  if (isLoading) {
    return (
      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-6 font-headline">
          Proposals
        </h2>
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
       <Card>
        <CardContent className="p-6 text-center">
          <p className="text-destructive">Could not fetch proposals. Make sure you are on the Sepolia network.</p>
        </CardContent>
      </Card>
    )
  }

  const count = proposalCount ? Number(proposalCount) : 0;

  if (count === 0) {
    return (
      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-6 font-headline">
          Proposals
        </h2>
        <Card>
          <CardContent className="p-10 text-center">
            <p className="text-muted-foreground">No proposals have been created yet.</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  // Create an array of IDs from count-1 down to 0
  const proposalIds = Array.from({ length: count }, (_, i) => count - 1 - i);

  return (
    <section>
       <h2 className="text-2xl font-semibold tracking-tight mb-6 font-headline">
          Proposals
        </h2>
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
        {proposalIds.map((id) => (
          <ProposalCard key={id} proposalId={BigInt(id)} />
        ))}
      </div>
    </section>
  );
}
