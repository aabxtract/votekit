🗳️ Wallet-Based Voting dApp

A minimal Ethereum voting application that allows wallets to vote once per proposal, with results recorded transparently on-chain.
Built with RainbowKit, wagmi, and Next.js for a modern Web3 experience.

🌍 Overview

This dApp enables trustless, transparent voting without tokens or complex DAO mechanics.

Each wallet = one voter

Votes are immutable and publicly verifiable

No centralized authority controlling results

Ideal for:

Student communities

Churches & fellowships

DAOs (lightweight governance)

Hackathons & demos

✨ Features

🌈 Wallet connection via RainbowKit

🗳️ Create and view voting proposals

🔐 One vote per wallet per proposal

⏱️ Time-bound voting

📊 Live on-chain vote results

📱 Mobile-responsive UI

⚡ Real-time transaction feedback

🧠 Why This Project?

This project demonstrates:

Wallet-based identity

Smart contract state management

Secure on-chain voting logic

Frontend ↔ smart contract interaction

It’s intentionally simple, making it perfect for:

Learning Ethereum

Proving Web3 frontend skills

Building a hackathon MVP fast

🏗️ Tech Stack
Frontend

Next.js (App Router)

TypeScript

RainbowKit

wagmi

ethers.js

Tailwind CSS

Blockchain

Solidity

Ethereum Sepolia Testnet

📜 Smart Contract Design
Core Structures
struct Proposal {
    string question;
    string[] options;
    uint256 endTime;
    bool active;
}

Voting Logic

Each wallet can vote only once

Votes are stored per proposal & option

Voting automatically closes after endTime

Core Functions

createProposal(question, options, duration)

vote(proposalId, optionIndex)

getProposal(proposalId)

getVotes(proposalId, optionIndex)

🚀 Getting Started
1️⃣ Clone the Repository
git clone https://github.com/your-username/wallet-voting-dapp
cd wallet-voting-dapp

2️⃣ Install Dependencies
npm install

3️⃣ Environment Variables

Create a .env.local file:

NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_CONTRACT_ADDRESS=deployed_contract_address
NEXT_PUBLIC_ADMIN_ADDRESS=admin_wallet_address

4️⃣ Run the App
npm run dev


Open http://localhost:3000 in your browser.

🔗 Wallet & Network

Supported wallets: MetaMask, WalletConnect

Network: Sepolia Testnet

Ensure your wallet is connected to Sepolia before interacting.

🧪 Usage Flow

Open the app

Connect wallet via RainbowKit

View active proposals

Select a voting option

Confirm transaction

Vote is recorded on-chain

Results update automatically

🛡️ Error Handling

Wallet must be connected

Voting disabled after deadline

Double voting prevented at contract level

Graceful handling of rejected transactions

Loading states during blockchain calls

🌱 Future Improvements

ENS-only voting

Hide results until voting ends

Proposal categories

Vote history per wallet

DAO / token-weighted version

Exportable results (JSON / CSV)

🏁 Conclusion

Wallet-Based Voting dApp shows how decentralized governance can be implemented simply, transparently, and securely using Ethereum — without unnecessary complexity.

A solid foundation for real-world community voting systems.

📄 License

MIT License