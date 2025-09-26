/**
 * Orderbook Hook
 * Provides blockchain interaction methods for offers and purchases
 * Based on frontend project implementation
 */

import { useCallback } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount, useWalletClient } from "wagmi";
import {
  CreateOfferParams,
  CreateOfferResult,
  AcceptOfferParams,
  AcceptOfferResult,
  CancelOfferParams,
  CancelOfferResult,
  ApiClient,
  CreateOfferHandler,
  AcceptOfferHandler,
  CancelOfferHandler,
  BuyListingHandler,
  BuyListingParams,
  BuyListingResult,
  GetSupportedCurrenciesRequest,
  GetOrderbookFeeRequest,
  RequestOptions,
  OnProgressCallback,
  Caip2ChainId,
  CurrencyToken,
  viemToEthersSigner
} from "@doma-protocol/orderbook-sdk";
import { orderbookConfig } from "@/lib/orderbook-config";

// Utility function to parse CAIP-10 format network IDs
function parseCAIP10(networkId: string): { namespace: string; chainId: string; address: string | null } {
  const parts = networkId.split(":");
  const namespace = parts[0];
  const chainId = parts[1];
  const address = parts[2] ?? null;
  return { namespace, chainId, address };
}

// Function to convert regular chain ID to CAIP-2 format
function toCAIP2ChainId(chainId: number | string): Caip2ChainId {
  return `eip155:${chainId}` as Caip2ChainId;
}

// Helper function to parse network ID - handles both CAIP-10 and numeric formats
function parseNetworkId(networkId: string | number): number {
  if (typeof networkId === 'number') {
    return networkId;
  }

  if (typeof networkId === 'string') {
    // If it contains ':' it's CAIP-10 format
    if (networkId.includes(':')) {
      return Number(parseCAIP10(networkId).chainId);
    } else {
      // Plain numeric string
      return Number(networkId);
    }
  }

  throw new Error(`Invalid network ID format: ${networkId}`);
}

// Note: Network switching is now handled by Wagmi automatically

export function useOrderbook() {
  // Privy for authentication
  const { user, connectWallet } = usePrivy();

  // Wagmi for blockchain operations
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const apiClient: ApiClient = new ApiClient(orderbookConfig.apiClientOptions);

  const ensureWalletConnected = useCallback(async () => {
    if (!user?.wallet?.address) {
      await connectWallet();
      return false;
    }
    return true;
  }, [user, connectWallet]);

  const createOffer = useCallback(async ({
    params,
    networkId,
    onProgress,
    hasWethOffer = false,
    currencies = []
  }: {
    params: CreateOfferParams;
    networkId: string | number;
    onProgress: OnProgressCallback;
    hasWethOffer?: boolean;
    currencies?: CurrencyToken[];
  }): Promise<CreateOfferResult> => {
    if (!(await ensureWalletConnected())) {
      throw new Error("Please connect your wallet first");
    }

    try {
      // Parse chain ID from network ID - supports both formats
      const chainId = parseNetworkId(networkId);

      console.log("🚀 Hybrid approach: Privy auth + Wagmi signer");
      console.log("🔗 Chain ID:", chainId);
      console.log("👛 Privy user address:", user?.wallet?.address);
      console.log("🔹 Wagmi address:", address);
      console.log("🔹 Wagmi connected:", isConnected);

      // Use Wagmi for signer creation (much cleaner!)
      if (!isConnected || !walletClient) {
        throw new Error("Wagmi wallet not connected");
      }

      // Convert Wagmi wallet client to ethers signer - like domain_space does it!
      const signer = viemToEthersSigner(walletClient, toCAIP2ChainId(chainId));

      console.log("✅ Signer created successfully using Wagmi");

      // Convert to CAIP-2 format
      const caip2ChainId = toCAIP2ChainId(chainId);

      const handler = new CreateOfferHandler(
        orderbookConfig,
        apiClient,
        signer,
        caip2ChainId,
        onProgress,
        {
          seaportBalanceAndApprovalChecksOnOrderCreation: !hasWethOffer,
        },
        currencies
      );

      return handler.execute(params);
    } catch (error) {
      console.error("Error creating offer:", error);
      throw error;
    }
  }, [ensureWalletConnected, user?.wallet?.address, address, isConnected, walletClient]);

  const acceptOffer = useCallback(async ({
    params,
    networkId,
    onProgress
  }: {
    params: AcceptOfferParams;
    networkId: string | number;
    onProgress: OnProgressCallback;
  }): Promise<AcceptOfferResult> => {
    if (!(await ensureWalletConnected())) {
      throw new Error("Please connect your wallet first");
    }

    try {
      // Parse chain ID from network ID - supports both formats
      const chainId = parseNetworkId(networkId);

      console.log("🚀 Accept Offer: Privy auth + Wagmi signer");
      console.log("🔗 Chain ID:", chainId);

      // Use Wagmi for signer creation (consistent with createOffer)
      if (!isConnected || !walletClient) {
        throw new Error("Wagmi wallet not connected");
      }

      // Convert Wagmi wallet client to ethers signer - like domain_space does it!
      const signer = viemToEthersSigner(walletClient, toCAIP2ChainId(chainId));

      console.log("✅ Signer created successfully using Wagmi");

      // Convert to CAIP-2 format
      const caip2ChainId = toCAIP2ChainId(chainId);

      const handler = new AcceptOfferHandler(
        orderbookConfig,
        apiClient,
        signer,
        caip2ChainId,
        onProgress
      );

      return handler.execute(params);
    } catch (error) {
      console.error("Error accepting offer:", error);
      throw error;
    }
  }, [ensureWalletConnected, isConnected, walletClient]);

  const cancelOffer = useCallback(async ({
    params,
    networkId,
    onProgress
  }: {
    params: CancelOfferParams;
    networkId: string | number;
    onProgress: OnProgressCallback;
  }): Promise<CancelOfferResult> => {
    if (!(await ensureWalletConnected())) {
      throw new Error("Please connect your wallet first");
    }

    try {
      // Parse chain ID from network ID - supports both formats
      const chainId = parseNetworkId(networkId);

      console.log("🚀 Cancel Offer: Privy auth + Wagmi signer");
      console.log("🔗 Chain ID:", chainId);

      // Use Wagmi for signer creation (consistent with createOffer)
      if (!isConnected || !walletClient) {
        throw new Error("Wagmi wallet not connected");
      }

      // Convert Wagmi wallet client to ethers signer - like domain_space does it!
      const signer = viemToEthersSigner(walletClient, toCAIP2ChainId(chainId));

      console.log("✅ Signer created successfully using Wagmi");

      // Convert to CAIP-2 format
      const caip2ChainId = toCAIP2ChainId(chainId);

      const handler = new CancelOfferHandler(
        orderbookConfig,
        apiClient,
        signer,
        caip2ChainId,
        onProgress
      );

      return handler.execute(params);
    } catch (error) {
      console.error("Error canceling offer:", error);
      throw error;
    }
  }, [ensureWalletConnected, isConnected, walletClient]);

  const buyListing = useCallback(async ({
    params,
    networkId,
    onProgress
  }: {
    params: BuyListingParams;
    networkId: string | number;
    onProgress: OnProgressCallback;
  }): Promise<BuyListingResult> => {
    if (!(await ensureWalletConnected())) {
      throw new Error("Please connect your wallet first");
    }

    try {
      // Parse chain ID from network ID - supports both formats
      const chainId = parseNetworkId(networkId);

      console.log("🚀 Buy Listing: Privy auth + Wagmi signer");
      console.log("🔗 Chain ID:", chainId);

      // Use Wagmi for signer creation (consistent with createOffer)
      if (!isConnected || !walletClient) {
        throw new Error("Wagmi wallet not connected");
      }

      // Convert Wagmi wallet client to ethers signer - like domain_space does it!
      const signer = viemToEthersSigner(walletClient, toCAIP2ChainId(chainId));

      console.log("✅ Signer created successfully using Wagmi");

      // Convert to CAIP-2 format
      const caip2ChainId = toCAIP2ChainId(chainId);

      const handler = new BuyListingHandler(
        orderbookConfig,
        apiClient,
        signer,
        caip2ChainId,
        onProgress
      );

      return handler.execute(params);
    } catch (error) {
      console.error("Error buying listing:", error);
      throw error;
    }
  }, [ensureWalletConnected, isConnected, walletClient]);

  const getSupportedCurrencies = useCallback(async (
    params: GetSupportedCurrenciesRequest,
    options?: RequestOptions
  ) => {
    try {
      return await apiClient.getSupportedCurrencies(params, options);
    } catch (error) {
      console.warn("API failed, providing fallback currencies:", error);

      // Provide fallback currencies based on network
      const networkId = typeof params === 'string' ? params : params.chainId;
      const fallbackCurrencies = [
        {
          name: "USD Coin",
          symbol: "USDC",
          decimals: 6,
          contractAddress: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
        },
        {
          name: "Wrapped Ether",
          symbol: "WETH",
          decimals: 18,
          contractAddress: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
        },
      ];

      return {
        currencies: fallbackCurrencies,
        data: fallbackCurrencies // Support both formats
      };
    }
  }, []);

  const getOrderbookFee = useCallback(async (
    params: GetOrderbookFeeRequest,
    options?: RequestOptions
  ) => {
    try {
      return await apiClient.getOrderbookFee(params, options);
    } catch (error) {
      console.warn("Fee API failed, providing fallback fee:", error);

      // Provide fallback fee structure
      return {
        marketplaceFees: [
          {
            recipient: "0x0000000000000000000000000000000000000000",
            basisPoints: 250 // 2.5%
          }
        ],
        data: [
          {
            recipient: "0x0000000000000000000000000000000000000000",
            basisPoints: 250 // 2.5%
          }
        ]
      };
    }
  }, []);

  return {
    createOffer,
    acceptOffer,
    cancelOffer,
    buyListing,
    getSupportedCurrencies,
    getOrderbookFee,
    isWalletConnected: !!user?.wallet?.address && isConnected,
    walletAddress: user?.wallet?.address || address,
  };
}