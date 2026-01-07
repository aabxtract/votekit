
'use client';

import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import { contractAddress, voterKitABI } from '@/lib/config';
import { ProposalCard } from '@/components/proposals/proposal-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/layout/header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { History } from 'lucide-react';

export default function HistoryPage() {
  const { address, isConnected } = useAccount();

  const { data: proposalCountData, isLoading: isLoadingCount } = useReadContract({
    address: contractAddress,
    abi: voterKitABI,
    functionName: 'proposalCount',
    query: {
      enabled: isConnected,
    }
  });
  const proposalCount = proposalCountData ? Number(proposalCountData) : 0;

  const hasVotedContracts = Array.from({ length: proposalCount }, (_, i) => ({
    address: contractAddress,
    abi: voterKitABI,
    functionName: 'hasVoted',
    args: [BigInt(i), address!],
  }));

  const { data: hasVotedResults, isLoading: isLoadingVotedStatus } = useReadContracts({
    contracts: hasVotedContracts,
    query: {
      enabled: isConnected && proposalCount > 0,
    }
  });

  const votedProposalIds = hasVotedResults
    ?.map((result, index) => (result.status === 'success' && result.result ? index : -1))
    .filter(id => id !== -1)
    .reverse(); // Show most recent first

  const isLoading = isLoadingCount || (proposalCount > 0 && isLoadingVotedStatus);

  return (
    <>
      <Header title="My Voting History" />
      <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {!isConnected && (
            <Alert>
                <History className="h-4 w-4" />
                <AlertTitle>Connect Your Wallet</AlertTitle>
                <AlertDescription>
                    Please connect your wallet to view your voting history.
                </AlertDescription>
            </Alert>
        )}

        {isConnected && isLoading && (
            <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-96 rounded-xl" />
                ))}
            </div>
        )}

        {isConnected && !isLoading && votedProposalIds && votedProposalIds.length > 0 && (
          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {votedProposalIds.map(id => (
              <ProposalCard key={id} proposalId={BigInt(id)} />
            ))}
          </div>
        )}

        {isConnected && !isLoading && (!votedProposalIds || votedProposalIds.length === 0) && (
             <Alert>
                <History className="h-4 w-4" />
                <AlertTitle>No Voting History Found</AlertTitle>
                <AlertDescription>
                    You have not voted on any proposals yet. Head back to the dashboard to participate!
                </AlertDescription>
            </Alert>
        )}
      </div>
    </>
  );
}
