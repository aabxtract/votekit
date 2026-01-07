'use client';

import { CreateProposalForm } from './create-proposal-form';

type AdminPanelProps = {
  onProposalCreated?: () => void;
};

export function AdminPanel({ onProposalCreated }: AdminPanelProps) {
  return <CreateProposalForm onProposalCreated={onProposalCreated} />;
}
