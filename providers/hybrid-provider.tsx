"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { QueryProvider } from "./query-provider";
import { AppKit } from "@/contexts/appkit";
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '@/config/wagmi';
import { XMTPProvider } from "@/contexts/xmtp-context";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function HybridProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppKit>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {/* Keep Privy for authentication but use Wagmi for wallet connection */}
          <PrivyProvider
            appId={
              process.env.NEXT_PUBLIC_PRIVY_APP_ID || "cmflanjor001nk10bxkfvokri"
            }
            config={{
              loginMethods: ["wallet", "email", "sms"],
              appearance: {
                theme: "dark",
                accentColor: "#A259FF",
                logo: "/noma_logo.svg",
              },
              embeddedWallets: {
                createOnLogin: "off",
                requireUserPasswordOnCreate: false,
              },
              mfa: {
                noPromptOnMfaRequired: false,
              },
            }}
          >
            <XMTPProvider>{children}</XMTPProvider>
          </PrivyProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </AppKit>
  );
}