/**
 * Improved Orderbook Hook using Wagmi
 * Based on domain_space implementation for better wallet handling
 */

import { useCallback } from "react";
import { useAccount, useWalletClient } from "wagmi";
import {
  CreateOfferParams,
  CreateOfferResult,
  AcceptOfferParams,
  AcceptOfferResult,
  CancelOfferParams,
  CancelOfferResult,
  BuyListingParams,
  BuyListingResult,
  GetSupportedCurrenciesRequest,
  GetOrderbookFeeRequest,
  RequestOptions,
  OnProgressCallback,
  Caip2ChainId,
  CurrencyToken,
  ApiClient,
  CreateOfferHandler,
  AcceptOfferHandler,
  CancelOfferHandler,
  BuyListingHandler,
  viemToEthersSigner
} from "@doma-protocol/orderbook-sdk";
import { orderbookConfig } from "@/lib/orderbook-config";

// Utility function to convert chain ID to CAIP-2 format
function toCAIP2ChainId(chainId: number | string): Caip2ChainId {
  return `eip155:${chainId}` as Caip2ChainId;
}

export function useOrderbookWagmi() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const apiClient = new ApiClient(orderbookConfig.apiClientOptions);

  const createOffer = useCallback(async ({
    params,
    chainId,
    onProgress,
    hasWethOffer = false,
    currencies = []
  }: {
    params: CreateOfferParams;
    chainId: string | number;
    onProgress: OnProgressCallback;
    hasWethOffer?: boolean;
    currencies?: CurrencyToken[];
  }): Promise<CreateOfferResult> => {
    if (!isConnected || !walletClient) {
      throw new Error("Please connect your wallet first");
    }

    try {
      // Convert chain ID to number if needed
      const numericChainId = typeof chainId === 'string' ?
        (chainId.includes(':') ? parseInt(chainId.split(':')[1]) : parseInt(chainId)) :
        chainId;

      console.log("🔗 Creating offer on chain ID:", numericChainId);
      console.log("👛 Using wallet address:", address);

      // Convert Wagmi wallet client to ethers signer
      const signer = viemToEthersSigner(walletClient, toCAIP2ChainId(numericChainId));

      console.log("✅ Signer created successfully from Wagmi");

      const handler = new CreateOfferHandler(
        orderbookConfig,
        apiClient,
        signer,
        toCAIP2ChainId(numericChainId),
        onProgress,
        {
          seaportBalanceAndApprovalChecksOnOrderCreation: !hasWethOffer,
        },
        currencies
      );

      const result = await handler.execute(params);
      console.log("🎉 Offer created successfully:", result);
      return result;
    } catch (error) {
      console.error("❌ Error creating offer:", error);
      throw error;
    }
  }, [isConnected, walletClient, address, apiClient]);

  const buyListing = useCallback(async ({
    params,
    chainId,
    onProgress
  }: {
    params: BuyListingParams;
    chainId: string | number;
    onProgress: OnProgressCallback;
  }): Promise<BuyListingResult> => {
    if (!isConnected || !walletClient) {
      throw new Error("Please connect your wallet first");
    }

    try {
      // Convert chain ID to number if needed
      const numericChainId = typeof chainId === 'string' ?
        (chainId.includes(':') ? parseInt(chainId.split(':')[1]) : parseInt(chainId)) :
        chainId;

      console.log("🔗 Buying on chain ID:", numericChainId);
      console.log("👛 Using wallet address:", address);

      // Convert Wagmi wallet client to ethers signer
      const signer = viemToEthersSigner(walletClient, toCAIP2ChainId(numericChainId));

      console.log("✅ Signer ready for purchase");

      const handler = new BuyListingHandler(
        orderbookConfig,
        apiClient,
        signer,
        toCAIP2ChainId(numericChainId),
        onProgress
      );

      const result = await handler.execute(params);
      console.log("🎉 Purchase completed successfully:", result);
      return result;
    } catch (error) {
      console.error("❌ Error buying listing:", error);
      throw error;
    }
  }, [isConnected, walletClient, address, apiClient]);

  const acceptOffer = useCallback(async ({
    params,
    chainId,
    onProgress
  }: {
    params: AcceptOfferParams;
    chainId: string | number;
    onProgress: OnProgressCallback;
  }): Promise<AcceptOfferResult> => {
    if (!isConnected || !walletClient) {
      throw new Error("Please connect your wallet first");
    }

    try {
      const numericChainId = typeof chainId === 'string' ?
        (chainId.includes(':') ? parseInt(chainId.split(':')[1]) : parseInt(chainId)) :
        chainId;

      const signer = viemToEthersSigner(walletClient, toCAIP2ChainId(numericChainId));

      const handler = new AcceptOfferHandler(
        orderbookConfig,
        apiClient,
        signer,
        toCAIP2ChainId(numericChainId),
        onProgress
      );

      return handler.execute(params);
    } catch (error) {
      console.error("❌ Error accepting offer:", error);
      throw error;
    }
  }, [isConnected, walletClient, apiClient]);

  const cancelOffer = useCallback(async ({
    params,
    chainId,
    onProgress
  }: {
    params: CancelOfferParams;
    chainId: string | number;
    onProgress: OnProgressCallback;
  }): Promise<CancelOfferResult> => {
    if (!isConnected || !walletClient) {
      throw new Error("Please connect your wallet first");
    }

    try {
      const numericChainId = typeof chainId === 'string' ?
        (chainId.includes(':') ? parseInt(chainId.split(':')[1]) : parseInt(chainId)) :
        chainId;

      const signer = viemToEthersSigner(walletClient, toCAIP2ChainId(numericChainId));

      const handler = new CancelOfferHandler(
        orderbookConfig,
        apiClient,
        signer,
        toCAIP2ChainId(numericChainId),
        onProgress
      );

      return handler.execute(params);
    } catch (error) {
      console.error("❌ Error canceling offer:", error);
      throw error;
    }
  }, [isConnected, walletClient, apiClient]);

  const getSupportedCurrencies = useCallback(async (
    params: GetSupportedCurrenciesRequest,
    options?: RequestOptions
  ) => {
    try {
      return await apiClient.getSupportedCurrencies(params, options);
    } catch (error) {
      console.warn("API failed, providing fallback currencies:", error);

      // Provide fallback currencies
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
        {
          name: "Ether",
          symbol: "ETH",
          decimals: 18,
          contractAddress: "0x0000000000000000000000000000000000000000",
        },
      ];

      return {
        currencies: fallbackCurrencies,
        data: fallbackCurrencies
      };
    }
  }, [apiClient]);

  const getOrderbookFee = useCallback(async (
    params: GetOrderbookFeeRequest,
    options?: RequestOptions
  ) => {
    try {
      return await apiClient.getOrderbookFee(params, options);
    } catch (error) {
      console.warn("Fee API failed, providing fallback fee:", error);

      return {
        marketplaceFees: [
          {
            recipient: "0x742d35Cc6634C0532925a3b8BC8Bce0D37bbE5",
            basisPoints: 250 // 2.5%
          }
        ],
        data: [
          {
            recipient: "0x742d35Cc6634C0532925a3b8BC8Bce0D37bbE5",
            basisPoints: 250 // 2.5%
          }
        ]
      };
    }
  }, [apiClient]);

  return {
    createOffer,
    acceptOffer,
    cancelOffer,
    buyListing,
    getSupportedCurrencies,
    getOrderbookFee,
    isWalletConnected: isConnected,
    walletAddress: address,
  };
}