# Sepolia Premium Faucet

A Web3 faucet application that distributes free Sepolia ETH to students learning blockchain development. Built with React, Vite, Wagmi, and RainbowKit.

## Features

- **Faucet** — Claim 0.05 Sepolia ETH per request; no queues, instant delivery.
- **Spin Wheel** — Daily spin for a chance to earn bonus Sepolia ETH (24-hour cooldown).
- **Bonus Program** — Earn extra rewards by watching ads (5 required per claim cycle).
- **Donate** — Contribute Sepolia ETH back to keep the faucet funded.
- **Dark / Light Mode** — System-aware theme with manual toggle.
- **Wallet Connect** — Powered by RainbowKit; supports MetaMask and WalletConnect wallets.

## Tech Stack

| Layer | Library / Tool |
|---|---|
| Framework | React 19 + Vite 7 |
| Routing | React Router DOM v7 |
| Web3 | Wagmi v3, Viem v2, Ethers v6 |
| Wallet UI | RainbowKit v2, MetaMask SDK |
| Data Fetching | TanStack Query v5 |
| Animations | Framer Motion v12, canvas-confetti |
| Styling | Tailwind CSS v3 |
| Icons | Lucide React |

## Prerequisites

- Node.js ≥ 18
- A [WalletConnect Cloud](https://cloud.walletconnect.com/) project ID

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/faucet-vite.git
cd faucet-vite
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the app

Open `src/config/wagmi.js` and replace the placeholder:

```js
projectId: 'YOUR_PROJECT_ID', // ← paste your WalletConnect project ID here
```

All other constants (contract address, reward amount, cooldowns) live in `src/config/constants.js`:

```js
export const CONFIG = {
    SEPOLIA_CHAIN_ID: 11155111,
    CONTRACT_ADDRESS: '0xe7378d385B6998F54146DaE5AEDf28f3Ac5b4ed7',
    REWARD_AMOUNT: '0.05',       // ETH per faucet claim
    REQUIRED_ADS: 5,             // ads to watch before bonus unlock
    SPIN_COOLDOWN_HOURS: 24,     // spin wheel cooldown
};
```

### 4. Run locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Project Structure

```
src/
├── components/
│   ├── dashboard/       # FaucetTab, SpinWheelTab, BonusTab, DonateTab
│   ├── layout/          # Header, Footer, Layout wrapper
│   └── ui/              # Shared UI primitives (Button, etc.)
├── config/
│   ├── constants.js     # App-wide configuration constants
│   └── wagmi.js         # Wagmi / RainbowKit setup
├── hooks/               # Custom React hooks
├── pages/
│   ├── Landing.jsx      # Public landing page
│   └── Dashboard.jsx    # Authenticated dashboard (tabbed)
└── utils/
    ├── ethers-adapters.js  # Ethers ↔ Wagmi bridge utilities
    └── theme.jsx           # Theme context & provider
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## Smart Contract

The faucet interacts with a smart contract deployed on the **Sepolia testnet**:

- **Network**: Ethereum Sepolia (Chain ID `11155111`)
- **Contract**: `0xe7378d385B6998F54146DaE5AEDf28f3Ac5b4ed7`

## License

MIT
