'use client';

import { useState } from 'react';
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { contractAddress, voterKitABI } from '@/lib/config';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { formatTimestamp } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download } from 'lucide-react';
import { Countdown } from './countdown';
import { VoteResults } from './vote-results';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';

type ProposalCardProps = {
  proposalId: bigint;
};

export function ProposalCard({ proposalId }: ProposalCardProps) {
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const [selectedOption, setSelectedOption] = useState<string | undefined>();
  const [showConfirm, setShowConfirm] = useState(false);

  const { data: proposal, isLoading: isLoadingProposal } = useReadContract({
    address: contractAddress,
    abi: voterKitABI,
    functionName: 'getProposal',
    args: [proposalId],
  });

  const { data: hasVoted, isLoading: isLoadingHasVoted } = useReadContract({
    address: contractAddress,
    abi: voterKitABI,
    functionName: 'hasVoted',
    args: [proposalId, address!],
    enabled: !!address,
  });

  const { data: hash, writeContract, isPending: isVotePending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  const isVotingClosed = proposal ? proposal.endTime < BigInt(Math.floor(Date.now() / 1000)) : false;
  const canVote = isConnected && !hasVoted && !isVotingClosed;
  const isLoading = isVotePending || isConfirming;

  const handleVote = () => {
    if (!selectedOption) return;
    writeContract({
      address: contractAddress,
      abi: voterKitABI,
      functionName: 'vote',
      args: [proposalId, BigInt(selectedOption)],
    });
    setShowConfirm(false);
    toast({
      title: 'Transaction Submitted',
      description: 'Waiting for your vote to be confirmed on the blockchain.',
    });
  };
  
  const handleExport = async () => {
    if (!proposal) return;
    
    // In a real app, you would fetch all votes here in a more optimized way
    const results = proposal.options.map((option, index) => ({
      option,
      // This part is simplified; ideally, vote counts are fetched or pre-aggregated
      votes: "Data needs to be fetched",
    }));

    const data = {
        id: proposalId.toString(),
        question: proposal.question,
        options: proposal.options,
        endTime: new Date(Number(proposal.endTime) * 1000).toISOString(),
        status: isVotingClosed ? "Closed" : "Open",
        results,
    };
    
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `proposal-${proposalId}-results.json`;
    link.click();
    toast({ title: "Results exported", description: `proposal-${proposalId}-results.json` });
  };


  if (isLoadingProposal || (isConnected && isLoadingHasVoted)) {
    return <Skeleton className="h-[450px] w-full rounded-xl" />;
  }

  if (!proposal) {
    return (
      <Card>
        <CardContent className="p-6">Proposal not found.</CardContent>
      </Card>
    );
  }

  const getVoteButtonText = () => {
    if (isLoading) return 'Submitting Vote...';
    if (!isConnected) return 'Connect Wallet to Vote';
    if (isVotingClosed) return 'Voting Closed';
    if (hasVoted) return 'You Have Already Voted';
    return 'Submit Vote';
  };

  return (
    <>
      <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <CardTitle className="font-headline text-xl">{proposal.question}</CardTitle>
            <Badge variant={isVotingClosed ? 'destructive' : 'default'}>
              {isVotingClosed ? 'Closed' : 'Open'}
            </Badge>
          </div>
          <CardDescription>
            Voting ends on {formatTimestamp(proposal.endTime)}.
            {!isVotingClosed && <Countdown endTime={proposal.endTime} />}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          {isVotingClosed || hasVoted ? (
            <VoteResults proposalId={proposalId} options={proposal.options} />
          ) : (
            <RadioGroup onValueChange={setSelectedOption} value={selectedOption} className="space-y-2">
              {proposal.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                  <RadioGroupItem value={index.toString()} id={`${proposalId}-${index}`} />
                  <Label htmlFor={`${proposalId}-${index}`} className="flex-1 cursor-pointer">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
           {canVote && (
            <Button 
              onClick={() => setShowConfirm(true)} 
              disabled={!selectedOption || isLoading}
              className="w-full sm:w-auto bg-accent hover:bg-accent/90"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {getVoteButtonText()}
            </Button>
          )}
          {!canVote && !isVotingClosed && (
            <Button disabled className="w-full sm:w-auto">
              {getVoteButtonText()}
            </Button>
          )}
          {isVotingClosed && (
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export Results
            </Button>
          )}
        </CardFooter>
      </Card>
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Your Vote</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to vote for "{proposal.options[Number(selectedOption)]}"? This action is irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleVote} className="bg-accent hover:bg-accent/90">Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
