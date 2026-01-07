'use client';

import { useAccount } from 'wagmi';
import { adminAddress } from '@/lib/config';
import { CreateProposalForm } from './create-proposal-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function AdminPanel() {
  const { address, isConnected } = useAccount();

  if (!isConnected || address !== adminAddress) {
    return null;
  }

  return (
    <Card className="border-2 border-primary/50 shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Admin Panel</CardTitle>
        <CardDescription>Create a new proposal for the community to vote on.</CardDescription>
      </CardHeader>
      <CardContent>
        <CreateProposalForm />
      </CardContent>
    </Card>
  );
}
