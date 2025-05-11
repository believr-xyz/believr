"use client";

import { useEffect, useState } from "react";
import { Login } from "@/components/login";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuthenticatedUser } from "@lens-protocol/react";
import { fetchAccount } from "@lens-protocol/client/actions";
import { getLensClient } from "@/lib/lens/client";

// Placeholder creator data with curated human photos
const leftColumnCreators = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format",
    alt: "Professional male creator",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format",
    alt: "Creative female artist",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format",
    alt: "Young male creator",
  },
];

const rightColumnCreators = [
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format",
    alt: "Fashion model creator",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1522556189639-b150ed9c4330?q=80&w=800&auto=format",
    alt: "Business professional",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format",
    alt: "Portrait photographer",
  },
];

export default function Home() {
  const [account, setAccount] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: user } = useAuthenticatedUser();

  useEffect(() => {
    async function checkAuth() {
      if (user) {
        try {
          const client = await getLensClient();
          if (client.isSessionClient()) {
            const authenticatedUser = client
              .getAuthenticatedUser()
              .unwrapOr(null);
            if (authenticatedUser) {
              const accnt = await fetchAccount(client, {
                address: authenticatedUser.address,
              });
              setAccount(accnt.unwrapOr(null));
            }
          }
        } catch (error) {
          console.error("Error fetching account:", error);
        }
      }
      setIsLoading(false);
    }

    checkAuth();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  // If user is already logged in, redirect to feed
  if (account) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="mb-4 text-center text-muted-foreground">
          You're already signed in. Check out the latest posts:
        </p>
        <Button className="mt-4" asChild>
          <a href="/feed">Go to Feed</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] w-full flex-col lg:flex-row">
      {/* Left side - Hero and CTA */}
      <div className="flex flex-1 flex-col justify-center px-4 py-6 lg:py-12">
        <Badge className="mb-6 w-fit bg-[#00A8FF] text-white hover:bg-[#00A8FF]/90">
          Welcome to Believr!
        </Badge>
        <h1 className="font-bold text-4xl tracking-tight md:text-5xl lg:text-6xl">
          Where early <br className="hidden md:inline" /> believers
          <span className="text-[#00A8FF]"> co-invest</span>{" "}
          <br className="hidden md:inline" /> in creators success
        </h1>

        <p className="mt-6 max-w-md text-lg text-muted-foreground">
          Believr is a decentralized social co-investing platform where early
          believers back creators they believe in and share in their success.
        </p>

        <div className="mt-10 max-w-xs">
          <Login />
        </div>
      </div>

      {/* Right side - Creator showcase with animations */}
      <div className="relative flex flex-1 items-center justify-center p-4">
        <div className="grid h-[600px] w-full max-w-2xl grid-cols-2 gap-4 overflow-hidden lg:gap-5">
          {/* Left column - scrolling up */}
          <div className="h-full overflow-hidden">
            <motion.div
              className="space-y-4 lg:space-y-5"
              animate={{ y: [0, -800, 0] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 45,
                ease: "linear",
              }}
            >
              {[...leftColumnCreators, ...leftColumnCreators].map(
                (creator, index) => (
                  <div
                    key={`left-${creator.id}-${index}`}
                    className="relative mb-4 aspect-[4/5] w-full overflow-hidden rounded-[32px] shadow-lg lg:mb-5"
                  >
                    <Image
                      src={creator.image}
                      alt={creator.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 400px"
                      className="object-cover"
                      priority={index === 0}
                    />
                  </div>
                )
              )}
            </motion.div>
          </div>

          {/* Right column - scrolling down */}
          <div className="h-full overflow-hidden">
            <motion.div
              className="space-y-4 lg:space-y-5"
              animate={{ y: [-800, 0, -800] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 45,
                ease: "linear",
              }}
            >
              {[...rightColumnCreators, ...rightColumnCreators].map(
                (creator, index) => (
                  <div
                    key={`right-${creator.id}-${index}`}
                    className="relative mb-4 aspect-[4/5] w-full overflow-hidden rounded-[32px] shadow-lg lg:mb-5"
                  >
                    <Image
                      src={creator.image}
                      alt={creator.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 400px"
                      className="object-cover"
                      priority={index === 0}
                    />
                  </div>
                )
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
