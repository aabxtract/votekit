'use server';

/**
 * @fileOverview An AI tool to monitor new proposals and flag those that contain invalid or illicit content.
 *
 * - flagIllicitProposals - A function that handles the proposal flagging process.
 * - FlagIllicitProposalsInput - The input type for the flagIllicitProposals function.
 * - FlagIllicitProposalsOutput - The return type for the flagIllicitProposals function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FlagIllicitProposalsInputSchema = z.object({
  question: z.string().describe('The question of the proposal.'),
  options: z.array(z.string()).describe('The voting options for the proposal.'),
});
export type FlagIllicitProposalsInput = z.infer<typeof FlagIllicitProposalsInputSchema>;

const FlagIllicitProposalsOutputSchema = z.object({
  isIllicit: z
    .boolean()
    .describe(
      'Whether or not the proposal contains invalid or illicit content based on VoterKit policies.'
    ),
  reason: z
    .string()
    .describe(
      'The reason why the proposal is flagged as illicit, based on VoterKit policies.'
    ),
});
export type FlagIllicitProposalsOutput = z.infer<typeof FlagIllicitProposalsOutputSchema>;

export async function flagIllicitProposals(
  input: FlagIllicitProposalsInput
): Promise<FlagIllicitProposalsOutput> {
  return flagIllicitProposalsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'flagIllicitProposalsPrompt',
  input: {schema: FlagIllicitProposalsInputSchema},
  output: {schema: FlagIllicitProposalsOutputSchema},
  prompt: `You are an AI assistant designed to evaluate proposals for the VoterKit platform.
Your role is to determine if a proposal contains invalid or illicit content based on VoterKit policies.

VoterKit policies include:
- No hate speech or discrimination
- No illegal activities or content
- No spam or misleading information
- Questions and options must be clear, coherent, and relevant.

Analyze the proposal based on the following information:

Question: {{{question}}}
Options: {{#each options}}{{{this}}}\n{{/each}}

Based on the above information, determine if the proposal is illicit or not, and provide a reason.
Set the isIllicit field to true if the proposal violates any of the VoterKit policies; otherwise, set it to false.
Provide a detailed reason for your determination in the reason field.

Output should be in JSON format.
`,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const flagIllicitProposalsFlow = ai.defineFlow(
  {
    name: 'flagIllicitProposalsFlow',
    inputSchema: FlagIllicitProposalsInputSchema,
    outputSchema: FlagIllicitProposalsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
