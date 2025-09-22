/**
 * Doma Orderbook SDK Configuration
 * Based on frontend project implementation
 */

import { DomaOrderbookSDKConfig } from "@doma-protocol/orderbook-sdk";

export const orderbookConfig: DomaOrderbookSDKConfig = {
  apiClientOptions: {
    baseUrl: "https://api-testnet.doma.xyz",
    defaultHeaders: {
      "api-key": process.env.NEXT_PUBLIC_DOMA_API_KEY || "v1.b41c8a7994253dca46b41630105ad89ff419a8111d008a303d3cb83655fe6553",
    },
  },
  source: "noma-marketplace",
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