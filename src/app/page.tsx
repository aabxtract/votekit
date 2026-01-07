import { AdminPanel } from '@/components/admin/admin-panel';
import { ProposalList } from '@/components/proposals/proposal-list';

export default function Home() {
  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl font-headline">
            Community Governance
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Have your say. Vote on proposals that shape our future. Your voice matters.
          </p>
        </div>

        <AdminPanel />
        
        <ProposalList />
      </div>
    </div>
  );
}
