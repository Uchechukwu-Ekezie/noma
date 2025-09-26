"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "wagmi";
import { QueryProvider } from "./query-provider";
import { XMTPProvider } from "@/contexts/xmtp-context";
import { config } from "@/config/wagmi";

export function PrivyProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={config}>
      <QueryProvider>
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
            // Add wallet connection options to handle provider conflicts
            supportedChains: [
              {
                id: 1,
                name: "Ethereum Mainnet",
                network: "homestead",
                nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
                rpcUrls: { default: { http: ["https://ethereum.publicnode.com"] } },
              },
              {
                id: 11155111,
                name: "Sepolia",
                network: "sepolia",
                nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
                rpcUrls: { default: { http: ["https://sepolia.gateway.tenderly.co"] } },
              },
              {
                id: 97476,
                name: "Doma Testnet",
                network: "doma-testnet",
                nativeCurrency: { name: "Doma Ether", symbol: "ETH", decimals: 18 },
                rpcUrls: { default: { http: ["https://rpc-testnet.doma.xyz"] } },
              },
            ],
          }}
        >
          <XMTPProvider>{children}</XMTPProvider>
        </PrivyProvider>
      </QueryProvider>
    </WagmiProvider>
  );
}
