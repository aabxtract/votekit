'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { adminAddress, contractAddress, voterKitABI } from '@/lib/config';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { flagIllicitProposals } from '@/ai/flows/flag-illicit-proposals';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const proposalFormSchema = z.object({
  question: z.string().min(10, {
    message: 'Question must be at least 10 characters.',
  }),
  options: z.array(
    z.object({
      value: z.string().min(1, { message: 'Option cannot be empty.' }),
    })
  ).min(2, { message: 'Must have at least two options.' }),
  duration: z.coerce.number().min(1, { message: 'Duration must be at least 1 day.' }),
});

type ProposalFormValues = z.infer<typeof proposalFormSchema>;

export function CreateProposalForm() {
  const { toast } = useToast();
  const [isAiChecking, setIsAiChecking] = useState(false);
  const [showIllicitConfirm, setShowIllicitConfirm] = useState(false);
  const [illicitReason, setIllicitReason] = useState('');
  const [formData, setFormData] = useState<ProposalFormValues | null>(null);

  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalFormSchema),
    defaultValues: {
      question: '',
      options: [{ value: '' }, { value: '' }],
      duration: 7,
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: 'options',
    control: form.control,
  });

  const { data: hash, writeContract, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
      onSuccess(data) {
        toast({
          title: 'Proposal Created',
          description: `Transaction confirmed: ${data.transactionHash}`,
        });
        form.reset();
      },
      onError(error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      },
    });

  async function onSubmit(data: ProposalFormValues) {
    setFormData(data);
    setIsAiChecking(true);
    try {
      const aiResult = await flagIllicitProposals({
        question: data.question,
        options: data.options.map((o) => o.value),
      });

      if (aiResult.isIllicit) {
        setIllicitReason(aiResult.reason);
        setShowIllicitConfirm(true);
      } else {
        await createProposal(data);
      }
    } catch (error) {
      console.error('AI check failed:', error);
      toast({
        title: 'AI Check Error',
        description: 'Could not verify proposal content. Please try again.',
        variant: 'destructive',
      });
      await createProposal(data); // Failsafe: proceed if AI check fails
    } finally {
      setIsAiChecking(false);
    }
  }

  async function createProposal(data: ProposalFormValues | null) {
    if (!data) return;
    const durationInSeconds = data.duration * 24 * 60 * 60;
    writeContract({
      address: contractAddress,
      abi: voterKitABI,
      functionName: 'createProposal',
      args: [data.question, data.options.map((o) => o.value), BigInt(durationInSeconds)],
      account: adminAddress,
    });
  }

  const isLoading = isPending || isConfirming || isAiChecking;

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question</FormLabel>
                <FormControl>
                  <Textarea placeholder="E.g., Should we increase the community pool?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel>Options</FormLabel>
            {fields.map((field, index) => (
              <FormField
                control={form.control}
                key={field.id}
                name={`options.${index}.value`}
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input {...field} placeholder={`Option ${index + 1}`} />
                      </FormControl>
                      {fields.length > 2 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ value: '' })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Option
            </Button>
          </div>

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Voting Duration (in days)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>The number of days the proposal will be active.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-accent hover:bg-accent/90">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isAiChecking ? 'Checking content...' : isPending ? 'Check wallet...' : isConfirming ? 'Confirming...' : 'Create Proposal'}
          </Button>
        </form>
      </Form>
      <AlertDialog open={showIllicitConfirm} onOpenChange={setShowIllicitConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Content Warning</AlertDialogTitle>
            <AlertDialogDescription>
              Our AI has flagged this proposal as potentially illicit for the following reason:
              <span className="block mt-2 font-semibold italic">{illicitReason}</span>
              Are you sure you want to create this proposal?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => createProposal(formData)}>
              Create Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
