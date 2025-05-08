# Believr

Believr is a decentralized social app for early believers that allows fans to co-invest in creators they believe in. Built on Lens Protocol, it helps creators raise funds and build loyal communities, while fans earn rewards and unlock exclusive access.

## Features

-   **Creator Fundraising**: Creators can launch campaigns to raise funds directly from their community for specific projects.
-   **Fan Co-investing**: Support your favorite creators by investing early in their journey.
-   **Exclusive Access**: Unlock premium content for being an early believer.
-   **Earn Rewards**: Receive token-based rewards tied to project success.
-   **Tokenized Incentives**: Use tokens to access content, claim rewards, and engage on the platform.
-   **Community Engagement**: Connect with like-minded fans and creators through social features.
-   **Lens Integration**: Built on Lens Protocol for transparency, ownership, and social interoperability.

## Tech Stack

-   **Frontend**: [Next.js 15](https://nextjs.org/), [TypeScript 5](https://www.typescriptlang.org/), [Tailwind CSS 4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
-   **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)
-   **Lens Integration**:
    -   [`@lens-protocol/client`](https://docs.lens.xyz/docs/introduction)
    -   [`@lens-protocol/react`](https://docs.lens.xyz/docs/react-intro)
    -   [`@lens-chain/sdk`](https://github.com/lens-protocol/lens-chain-sdk)
-   **Web3 Integration**: [wagmi](https://wagmi.sh/), [viem](https://viem.sh/), [ConnectKit](https://docs.family.co/connectkit)
-   **Forms & Validation**: [react-hook-form](https://react-hook-form.com/), [zod](https://zod.dev/)
-   **Data Fetching**: [TanStack Query](https://tanstack.com/query)
-   **Date Handling**: [date-fns](https://date-fns.org/)
-   **Charts & Visualization**: [Recharts](https://recharts.org/)
-   **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)
-   **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

## Setup

### Prerequisites

-   Node.js 18+
-   **Package Manager**: [Bun](https://bun.sh/)
-   **Linting & Formatting**: [Biome](https://biomejs.dev/)

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
