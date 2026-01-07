'use client';

import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { contractAddress, voterKitABI } from '@/lib/config';
import { useReadContract, useReadContracts } from 'wagmi';

type VoteResultsProps = {
  proposalId: bigint;
  options: readonly string[];
};

export function VoteResults({ proposalId, options }: VoteResultsProps) {
  const contracts = options.map((_, index) => ({
    address: contractAddress,
    abi: voterKitABI,
    functionName: 'getVotes',
    args: [proposalId, BigInt(index)],
  }));

  const { data: voteCounts, isLoading: isLoadingVotes, isError } = useReadContracts({
    contracts,
    query: {
        refetchInterval: 5000, // refresh every 5s
    }
  });
  
  const { data: totalVotesData, isLoading: isLoadingTotal } = useReadContract({
    address: contractAddress,
    abi: voterKitABI,
    functionName: 'getTotalVotes',
    args: [proposalId],
     query: {
        refetchInterval: 5000, // refresh every 5s
    }
  });

  const totalVotes = totalVotesData ? Number(totalVotesData) : 0;
  
  if (isLoadingVotes || isLoadingTotal) {
    return (
      <div className="space-y-4">
        {options.map((_, index) => (
          <div key={index}>
            <Skeleton className="h-4 w-1/3 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
     return <p className="text-sm text-destructive">Could not load results.</p>
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-muted-foreground">{totalVotes} Total Votes</p>
      {options.map((option, index) => {
        const votes = voteCounts?.[index]?.result ? Number(voteCounts[index].result) : 0;
        const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;

        return (
          <div key={index}>
            <div className="flex justify-between items-center mb-1 text-sm">
              <span className="font-medium">{option}</span>
              <span className="text-muted-foreground">
                {votes} votes ({percentage.toFixed(1)}%)
              </span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
        );
      })}
    </div>
  );
}
