import { type Address } from 'viem';

// This is a placeholder address. Replace it with your deployed contract address on Sepolia.
export const contractAddress: Address = '0x9A52aE1A91494553257A115bEC556b430805988D';

// This is a placeholder address. Replace it with the admin wallet address.
export const adminAddress: Address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

export const voterKitABI = [
  {
    "type": "function",
    "name": "createProposal",
    "inputs": [
      { "name": "question", "type": "string", "internalType": "string" },
      { "name": "options", "type": "string[]", "internalType": "string[]" },
      { "name": "duration", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "vote",
    "inputs": [
      { "name": "proposalId", "type": "uint256", "internalType": "uint256" },
      { "name": "optionIndex", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getProposal",
    "inputs": [{ "name": "proposalId", "type": "uint256", "internalType": "uint256" }],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct VoterKit.Proposal",
        "components": [
          { "name": "question", "type": "string", "internalType": "string" },
          { "name": "options", "type": "string[]", "internalType": "string[]" },
          { "name": "endTime", "type": "uint256", "internalType": "uint256" },
          { "name": "active", "type": "bool", "internalType": "bool" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getVotes",
    "inputs": [
      { "name": "proposalId", "type": "uint256", "internalType": "uint256" },
      { "name": "optionIndex", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "proposalCount",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "hasVoted",
    "inputs": [
      { "name": "proposalId", "type": "uint256", "internalType": "uint256" },
      { "name": "voter", "type": "address", "internalType": "address" }
    ],
    "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
    "stateMutability": "view"
  },
   {
    "type": "function",
    "name": "getTotalVotes",
    "inputs": [
      { "name": "proposalId", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [
      { "name": "", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "view"
  }
] as const;
