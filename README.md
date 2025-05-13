# Believr

Believr is a decentralized social platform where early believers co-invest in creators they believe in and share in their rise. Built on Lens Protocol, it enables creators to launch tokenized posts or campaigns to gain support, while backers earn rewards, access, and a stake in their journey.

## Features

- **Login with Lens Profile**
  Sign in by connecting your wallet and Lens profile.

- **Tokenized Creator Posts**
  Creators can launch tokenized posts to gain early backing from their community.

- **Believer Co-Investing**
  Back your favorite creators early by collecting tokenized posts to earn rewards, exclusive access, and a stake in their journey.

- **Lens-Powered Social Layer**
  Creators and believers connect, share, and engage in a community-led space powered by Lens Protocol's social primitives.

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
