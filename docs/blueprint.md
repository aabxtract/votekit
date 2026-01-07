# **App Name**: VoterKit

## Core Features:

- Wallet Connection: Connect to the dApp using RainbowKit, supporting MetaMask and WalletConnect.
- Proposal Display: Display a list of active proposals with details such as question, voting options, end time, and status (Open/Closed).
- Vote Submission: Allow users to vote once per proposal, disabling voting if the wallet is not connected, the voting period has ended, or the user has already voted. Show a confirmation before submitting the vote.
- Vote Results: Display live vote counts and percentages for each option. Lock results when the proposal ends. There is an admin tool to export the results to JSON.
- Error Handling: Prevent double voting and handle rejected transactions gracefully. Show loading states during voting and display clear success/error messages.
- Admin Proposal Creation: Allow the admin wallet to create new proposals and set voting durations. This interface should be conditionally rendered when the user has the privileges, so only the admin sees it.
- Active Proposal Filtering: An AI tool monitors all proposals and flags or removes those with invalid question fields or illicit content, according to the policies of VoterKit.

## Style Guidelines:

- Primary color: Deep purple (#6750A4) to evoke trust and sophistication.
- Background color: Very light purple (#F2EFF7) providing a neutral backdrop.
- Accent color: Teal (#49A498), a contrasting but related hue, used for highlights and active buttons.
- Font: 'Inter', a grotesque-style sans-serif, used for both headlines and body text.
- Card-based layout for proposals, ensuring a clean and organized presentation. Mobile-first responsive design to ensure usability across devices.
- Rounded buttons & inputs with clear call-to-action buttons to guide user interaction.
- Subtle loading animations during voting to provide user feedback and enhance the overall experience.