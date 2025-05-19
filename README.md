<a href="https://believr.fun">
  <img alt="Believr – Co-invest in creators you believe in" src="/public/cover.png">
  <h1 align="center">Believr</h1>
</a>

<p align="center">
  A decentralized social platform where early believers co-invest in creators they believe in and share in their rise. Built on Lens Protocol, it enables creators to launch tokenized posts or campaigns to gain support, while backers earn rewards, access, and a stake in their journey.
</p>

## Problem

### For Creators

- **Value Capture**: Struggle to capture the value they create, especially from their most dedicated supporters
- **Platform Dependency**: Rely heavily on platform algorithms and advertising for monetization
- **Community Recognition**: No way to reward and recognize early supporters who believed in them before success
- **Fan Engagement**: Limited tools to build meaningful relationships with their most valuable supporters

### For Fans

- **Early Support**: No way to be recognized for supporting creators before they became successful
- **Value Sharing**: Can't share in the success of creators they believed in early
- **Access**: Limited opportunities to get exclusive access to creators they support
- **Engagement**: Traditional platforms don't facilitate meaningful creator-fan relationships

## Solution

Believr introduces a novel approach to creator-fan relationships:

### For Creators

- **Tokenized Content**: Convert posts into investable assets, creating new revenue streams
- **Direct Monetization**: Earn directly from your most dedicated supporters, reducing platform dependency
- **Community Building**: Build stronger relationships with early supporters through token ownership
- **Value Recognition**: Reward and recognize early believers through token appreciation

### For Fans

- **Early Investment**: Get in early on creators you believe in through tokenized posts
- **Value Appreciation**: Share in creators' success as their tokens appreciate in value
- **Exclusive Access**: Gain special access and rewards as an early supporter
- **Meaningful Connection**: Build deeper relationships with creators through token ownership

## Features

- **Login with Lens Profile**
  Sign in by connecting your wallet and Lens profile.

- **Tokenized Creator Posts**
  Creators can launch tokenized posts to gain early backing from their community.

- **Believer Co-Investing**
  Back your favorite creators early by collecting tokenized posts to earn rewards, exclusive access, and a stake in their journey.

- **Lens-Powered Social Layer**
  Creators and believers connect, share, and engage in a community-led space powered by Lens Protocol's social primitives.

## How it Works

### Architectural Diagram

## Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/), [TypeScript 5](https://www.typescriptlang.org/), [Tailwind CSS 4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Lens Integration**:
  - [`@lens-protocol/client`](https://docs.lens.xyz/docs/introduction)
  - [`@lens-protocol/react`](https://docs.lens.xyz/docs/react-intro)
  - [`@lens-chain/sdk`](https://github.com/lens-protocol/lens-chain-sdk)
- **Web3 Integration**: [wagmi](https://wagmi.sh/), [viem](https://viem.sh/), [ConnectKit](https://docs.family.co/connectkit)
- **Forms & Validation**: [react-hook-form](https://react-hook-form.com/), [zod](https://zod.dev/)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Charts & Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

## Setup

### Prerequisites

- Node.js 18+
- **Package Manager**: [Bun](https://bun.sh/)
- **Linting & Formatting**: [Biome](https://biomejs.dev/)

1. Clone the repository:

   ```bash
   git clone https://github.com/believr-fun/believr.git
   cd believr
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Set up environment variables:

   ```bash
   cp env.example .env
   ```

   Then edit `.env` and add your API keys and credentials:

   - Create a Lens app at [https://developer.lens.xyz/apps](https://developer.lens.xyz/apps)
   - Copy your App ID and paste it into the `.env` file as `NEXT_PUBLIC_APP_ADDRESS`

4. Start the development server:

   ```bash
   bun run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser

## Guide

### Project Structure

```
src/
├── app/                    # Next.js app directory (pages and layouts)
├── components/            # Reusable React components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and shared logic
├── contracts/           # Smart contract interactions and ABIs
├── styles/              # Global styles and Tailwind configurations
└── env.ts               # Environment configuration
```

## Roadmap

- [ ]
- [ ]
- [ ]
- [ ]

## Contributing

1. Create a new branch
2. Make your changes
3. Submit a pull request
