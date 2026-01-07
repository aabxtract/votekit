'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Countdown } from './countdown';
import { useAccount } from 'wagmi';

type DemoProposalCardProps = {
  proposal: {
    id: bigint;
    question: string;
    options: string[];
    endTime: bigint;
    isVotingClosed: boolean;
    tags?: string[];
  };
};

export function DemoProposalCard({ proposal }: DemoProposalCardProps) {
  const { toast } = useToast();
  const { isConnected } = useAccount();
  const [selectedOption, setSelectedOption] = useState<string | undefined>();
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const canVote = isConnected && !hasVoted && !proposal.isVotingClosed;

  const handleVote = () => {
    if (!selectedOption) return;
    setIsLoading(true);
    setTimeout(() => {
      setHasVoted(true);
      setIsLoading(false);
      toast({
        title: 'Vote Submitted (Demo)',
        description: `You voted for "${proposal.options[parseInt(selectedOption, 10)]}".`,
      });
    }, 1000);
  };

  const getVoteButtonText = () => {
    if (isLoading) return 'Submitting Vote...';
    if (!isConnected) return 'Connect Wallet to Vote';
    if (proposal.isVotingClosed) return 'Voting Closed';
    if (hasVoted) return 'You Have Already Voted';
    return 'Submit Vote';
  };

  return (
    <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="font-headline text-xl">{proposal.question}</CardTitle>
          <Badge variant={proposal.isVotingClosed ? 'destructive' : 'default'}>
            {proposal.isVotingClosed ? 'Closed' : 'Open'}
          </Badge>
        </div>
        <CardDescription>
          Voting ends on {new Date(Number(proposal.endTime) * 1000).toLocaleString()}.
          {!proposal.isVotingClosed && <Countdown endTime={proposal.endTime} />}
        </CardDescription>
        {proposal.tags && (
          <div className="flex flex-wrap gap-2 pt-2">
            {proposal.tags.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        {proposal.isVotingClosed || hasVoted ? (
           <div className="space-y-4">
            <p className="text-sm font-medium text-muted-foreground">Demo results are not available.</p>
           </div>
        ) : (
          <RadioGroup onValueChange={setSelectedOption} value={selectedOption} className="space-y-2">
            {proposal.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                <RadioGroupItem value={index.toString()} id={`${proposal.id}-${index}`} />
                <Label htmlFor={`${proposal.id}-${index}`} className="flex-1 cursor-pointer">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        {canVote && (
          <Button 
            onClick={handleVote} 
            disabled={!selectedOption || isLoading}
            className="w-full sm:w-auto bg-accent hover:bg-accent/90"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {getVoteButtonText()}
          </Button>
        )}
        {!canVote && (
          <Button disabled className="w-full sm:w-auto">
            {getVoteButtonText()}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
