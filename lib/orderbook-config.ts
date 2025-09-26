/**
 * Doma Orderbook SDK Configuration
 * Based on frontend project implementation
 */

import { DomaOrderbookSDKConfig } from "@doma-protocol/orderbook-sdk";

export const orderbookConfig: DomaOrderbookSDKConfig = {
  apiClientOptions: {
    baseUrl: process.env.NEXT_PUBLIC_DOMA_URL || "https://api-testnet.doma.xyz",
    defaultHeaders: {
      "Api-Key": process.env.NEXT_PUBLIC_DOMA_API_KEY || "v1.0da7d21e76552ca517ef3794e2d80b18b8886a5190b633365741b2b86e6926a9",
    },
  },
  source: process.env.NEXT_PUBLIC_APP_NAME || "noma-marketplace",
  chains: [
    {
      id: 1,
      name: "Ethereum",
      nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: {
        default: {
          http: ["https://ethereum.publicnode.com"],
        },
      },
      blockExplorers: {
        default: {
          name: "Etherscan",
          url: "https://etherscan.io",
        },
      },
    },
    {
      id: 11155111,
      name: "Sepolia",
      nativeCurrency: {
        name: "Sepolia Ether",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: {
        default: {
          http: ["https://sepolia.gateway.tenderly.co"],
        },
      },
      blockExplorers: {
        default: {
          name: "Etherscan",
          url: "https://sepolia.etherscan.io",
        },
      },
    },
    {
      id: 97476,
      name: "Doma Testnet",
      nativeCurrency: {
        name: "Doma Ether",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: {
        default: {
          http: ["https://rpc-testnet.doma.xyz"],
        },
      },
      blockExplorers: {
        default: {
          name: "Doma Explorer",
          url: "https://explorer-testnet.doma.xyz",
        },
      },
    },
  ],
};