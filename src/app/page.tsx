'use client';
import { useState } from 'react';
import { AdminPanel } from '@/components/admin/admin-panel';
import { ProposalList } from '@/components/proposals/proposal-list';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAccount } from 'wagmi';

export default function Home() {
  const [open, setOpen] = useState(false);
  const { isConnected } = useAccount();

  return (
    <>
      <Header title="Governance Dashboard">
        {isConnected && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle />
                <span>Create Proposal</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Create Proposal</DialogTitle>
                <DialogDescription>
                  Fill out the form below to create a new proposal for the community to vote on.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                 <AdminPanel onProposalCreated={() => setOpen(false)} />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </Header>
      <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <ProposalList />
      </div>
    </>
  );
}
