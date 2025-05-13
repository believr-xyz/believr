"use client";

/**
 * Token Balance Hook
 *
 * This hook fetches and manages token balances for the authenticated user on Lens Chain.
 *
 * Key Features:
 * - Fetches the official token list from Lens API
 * - Includes essential Lens Chain tokens (GHO, WGHO, WETH, USDC)
 * - Uses multicall for efficient balance querying
 * - Handles proper formatting of token balances with decimals
 * - Provides fallback to mock data for development
 *
 * Token addresses are based on the current Lens Chain deployment:
 * - GHO Token (native): 0x000000000000000000000000000000000000800A
 * - Wrapped GHO: 0x6bDc36E20D267Ff0dd6097799f82e78907105e2F
 * - Wrapped ETH: 0xE5ecd226b3032910CEaa43ba92EE8232f8237553
 * - USDC: 0x88F08E304EC4f90D644Cec3Fb69b8aD414acf884
 */

import { getLensClient } from "@/lib/lens/client";
import { chains } from "@lens-chain/sdk/viem";
import { useAuthenticatedUser } from "@lens-protocol/react";
import { useCallback, useEffect, useState } from "react";
import { http, createPublicClient } from "viem";

// ERC20 ABI for balanceOf
const erc20Abi = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

interface Token {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
}

interface TokenBalance {
  token: Token;
  balance: string;
  rawBalance: bigint;
}

interface BalanceData {
  balances: TokenBalance[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Important native tokens on Lens Chain
const DEFAULT_TOKENS: Token[] = [
  {
    chainId: 232,
    address: "0x000000000000000000000000000000000000800A",
    name: "GHO Token",
    symbol: "GHO",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/MetaMask/contract-metadata/master/icons/eip155:1/erc20:0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f.svg",
  },
  {
    chainId: 232,
    address: "0x6bDc36E20D267Ff0dd6097799f82e78907105e2F",
    name: "Wrapped GHO Token",
    symbol: "WGHO",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/MetaMask/contract-metadata/master/icons/eip155:1/erc20:0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f.svg",
  },
  {
    chainId: 232,
    address: "0xE5ecd226b3032910CEaa43ba92EE8232f8237553",
    name: "Wrapped Ether",
    symbol: "WETH",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/MetaMask/contract-metadata/master/icons/eip155:1/erc20:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2.svg",
  },
  {
    chainId: 232,
    address: "0x88F08E304EC4f90D644Cec3Fb69b8aD414acf884",
    name: "USDC",
    symbol: "USDC",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/MetaMask/contract-metadata/master/icons/eip155:1/erc20:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48.svg",
  },
];

export function useBalance(): BalanceData {
  const { data: user } = useAuthenticatedUser();
  const [tokens, setTokens] = useState<Token[]>(DEFAULT_TOKENS);
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch token list
  useEffect(() => {
    const fetchTokenList = async () => {
      try {
        // Fetch the official token list from Lens
        const response = await fetch("https://lens.xyz/DOCS/tokenlist.json");
        const data = await response.json();

        if (data?.tokens && Array.isArray(data.tokens)) {
          // Filter tokens for Lens Chain (chainId 232)
          const lensChainTokens = data.tokens.filter((token: Token) => token.chainId === 232);

          // Make sure GHO Token is included
          const ghoExists = lensChainTokens.some(
            (token: Token) =>
              token.address.toLowerCase() === DEFAULT_TOKENS[0].address.toLowerCase(),
          );

          const finalTokens = ghoExists ? lensChainTokens : [...lensChainTokens, DEFAULT_TOKENS[0]];

          setTokens(finalTokens);
        } else {
          // Use default tokens if token list fetch fails
          setTokens(DEFAULT_TOKENS);
        }
      } catch (err) {
        console.error("Failed to fetch token list:", err);
        // Fall back to default tokens on error
        setTokens(DEFAULT_TOKENS);
      }
    };

    fetchTokenList();
  }, []);

  // Fetch balances
  const fetchBalances = useCallback(async () => {
    if (!user || tokens.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const publicClient = createPublicClient({
        chain: chains.mainnet,
        transport: http(),
      });

      if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
        // In production, use multicall for efficiency
        const calls = tokens.map((token) => ({
          address: token.address as `0x${string}`,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [user.address as `0x${string}`],
        }));

        const results = await publicClient.multicall({
          contracts: calls,
        });

        const tokenBalances = results.map((result, index) => {
          const rawBalance = (result.result as bigint) || BigInt(0);
          return {
            token: tokens[index],
            rawBalance,
            balance: formatTokenBalance(rawBalance, tokens[index].decimals),
          };
        });

        setBalances(tokenBalances);
      } else {
        // For MVP, generate mock balances
        await new Promise((resolve) => setTimeout(resolve, 800));

        const mockBalances = tokens.map((token) => {
          // Create realistic-looking balances with more variance
          const maxAmount = token.symbol === "USDC" ? 1000000000 : 10000000000;
          const randomBalance = BigInt(Math.floor(Math.random() * maxAmount));
          return {
            token,
            rawBalance: randomBalance,
            balance: formatTokenBalance(randomBalance, token.decimals),
          };
        });

        setBalances(mockBalances);
      }
    } catch (err) {
      console.error("Failed to fetch balances:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch balances"));
    } finally {
      setIsLoading(false);
    }
  }, [user, tokens]);

  // Format token balance with proper decimals
  function formatTokenBalance(balance: bigint, decimals: number): string {
    if (balance === BigInt(0)) return "0";

    const divisor = BigInt(10) ** BigInt(decimals);
    const integerPart = balance / divisor;
    const fractionalPart = balance % divisor;

    if (fractionalPart === BigInt(0)) {
      return integerPart.toString();
    }

    // Format the fractional part to have leading zeros
    let fractionalStr = fractionalPart.toString().padStart(decimals, "0");

    // Trim trailing zeros
    fractionalStr = fractionalStr.replace(/0+$/, "");

    // For better readability, limit to 4 decimal places
    const significantDecimals = 4;
    if (fractionalStr.length > significantDecimals) {
      fractionalStr = fractionalStr.substring(0, significantDecimals);
    }

    return `${integerPart}.${fractionalStr}`;
  }

  // Initial fetch and refresh on user or tokens change
  useEffect(() => {
    if (user) {
      fetchBalances();
    }
  }, [user, tokens, fetchBalances]);

  return {
    balances,
    isLoading,
    error,
    refetch: fetchBalances,
  };
}
