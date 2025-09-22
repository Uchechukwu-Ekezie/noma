/**
 * Orderbook Hook
 * Provides blockchain interaction methods for offers and purchases
 * Based on frontend project implementation
 */

import { useCallback } from "react";
import { usePrivy } from "@privy-io/react-auth";
import {
  CreateOfferParams,
  CreateOfferResult,
  AcceptOfferParams,
  AcceptOfferResult,
  CancelOfferParams,
  CancelOfferResult,
  Currency,
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
  CurrencyToken
} from "@doma-protocol/orderbook-sdk";
import { BrowserProvider } from "ethers";
import { orderbookConfig } from "@/lib/orderbook-config";
import { toast } from "sonner";

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

// Create a mock wallet client for network switching
function createMockWalletClient() {
  return {
    switchChain: async ({ id }: { id: number }) => {
      console.log(`🔄 Switching to chain ${id}`);

      // Get the provider from the user's wallet
      const provider = new BrowserProvider(window.ethereum);

      // Check current network
      const network = await provider.getNetwork();
      if (Number(network.chainId) !== id) {
        try {
          // First try to switch to the network
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${id.toString(16)}` }],
          });
          console.log(`✅ Successfully switched to chain ${id}`);
        } catch (switchError: any) {
          console.log(`❌ Switch failed:`, switchError);

          // If the network doesn't exist, try to add it
          const needsNetworkAddition = switchError.code === 4902 ||
              switchError.code === -32603 ||
              switchError.message?.toLowerCase().includes('unrecognized chain') ||
              switchError.message?.toLowerCase().includes('chain id') ||
              switchError.message?.includes('wallet_addEthereumChain') ||
              switchError.message?.includes('does not exist') ||
              switchError.message?.includes('not found');

          if (needsNetworkAddition) {
            try {
              console.log(`🔧 Network not found, attempting to add network for chain ${id}`);
              const networkParams = getNetworkParams(id);
              console.log(`Network params to add:`, networkParams);

              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [networkParams],
              });
              console.log(`✅ Successfully added and switched to chain ${id}`);
            } catch (addError: any) {
              console.error(`❌ Failed to add network:`, addError);
              throw new Error(`Failed to add network: ${addError.message}`);
            }
          } else {
            console.error(`❌ Failed to switch network (not a missing network error):`, switchError);
            throw new Error(`Failed to switch network: ${switchError.message}`);
          }
        }
      }
    }
  };
}

// Helper function to get network parameters for wallet_addEthereumChain
function getNetworkParams(chainId: number) {
  switch (chainId) {
    case 1:
      return {
        chainId: '0x1',
        chainName: 'Ethereum',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: ['https://ethereum.publicnode.com'],
        blockExplorerUrls: ['https://etherscan.io'],
      };
    case 11155111:
      return {
        chainId: '0xaa36a7',
        chainName: 'Sepolia',
        nativeCurrency: {
          name: 'Sepolia Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: ['https://sepolia.gateway.tenderly.co'],
        blockExplorerUrls: ['https://sepolia.etherscan.io'],
      };
    case 97476:
      return {
        chainId: '0x17cc4',
        chainName: 'Doma Testnet',
        nativeCurrency: {
          name: 'Doma Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: ['https://rpc-testnet.doma.xyz'],
        blockExplorerUrls: ['https://explorer-testnet.doma.xyz'],
      };
    default:
      throw new Error(`Unsupported chain ID: ${chainId}`);
  }
}

export function useOrderbook() {
  const { user, connectWallet } = usePrivy();

  const apiClient: ApiClient = new ApiClient(orderbookConfig.apiClientOptions);
  const walletClient = createMockWalletClient();

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
    networkId: string;
    onProgress: OnProgressCallback;
    hasWethOffer?: boolean;
    currencies?: CurrencyToken[];
  }): Promise<CreateOfferResult> => {
    if (!(await ensureWalletConnected())) {
      throw new Error("Please connect your wallet first");
    }

    try {
      // Parse chain ID from network ID
      const chainId = Number(parseCAIP10(networkId).chainId);

      // Switch to the correct network
      await walletClient.switchChain({ id: chainId });

      // Create signer using Privy's wallet provider
      if (!user?.wallet?.address) {
        throw new Error("No wallet connected");
      }

      console.log("=== WALLET DEBUG INFO ===");
      console.log("Privy user:", user);
      console.log("Privy wallet:", user.wallet);
      console.log("Expected address:", user.wallet.address);

      // Get provider - for external wallets, use window.ethereum directly
      let privyProvider;

      if (user.wallet.getEthereumProvider) {
        // Embedded wallet
        privyProvider = await user.wallet.getEthereumProvider();
        console.log("Using embedded wallet provider:", privyProvider);
      } else {
        // External wallet - use window.ethereum
        privyProvider = window.ethereum;
        console.log("Using external wallet provider (window.ethereum):", privyProvider);
      }

      const provider = new BrowserProvider(privyProvider);

      // Check all available accounts
      const accounts = await provider.listAccounts();
      console.log("Available accounts:", accounts.map(acc => acc.address));

      // Force the provider to use the correct account by switching to it first
      try {
        console.log("Attempting to switch to Privy wallet address...");
        await privyProvider.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }],
        });

        // Request accounts to ensure the correct one is selected
        const requestedAccounts = await privyProvider.request({
          method: 'eth_requestAccounts',
        });
        console.log("Requested accounts:", requestedAccounts);

        // Check if our target address is in the requested accounts
        const targetAddress = user.wallet.address.toLowerCase();
        const foundAccount = requestedAccounts.find((addr: string) => addr.toLowerCase() === targetAddress);

        if (!foundAccount) {
          console.log("Target address not found in requested accounts, trying to switch...");
          // Try to switch to the specific account
          try {
            await privyProvider.request({
              method: 'wallet_switchEthereumAccount',
              params: [targetAddress],
            });
          } catch (switchError) {
            console.log("wallet_switchEthereumAccount not supported, continuing...");
          }
        }
      } catch (permissionError) {
        console.log("Permission request failed, continuing with default flow:", permissionError);
      }

      // Now get the signer
      let signer;
      try {
        // First try getting the signer normally
        signer = await provider.getSigner();
        const signerAddress = await signer.getAddress();
        console.log("Default signer address:", signerAddress);

        // If it doesn't match, try to get signer for the specific account index
        if (signerAddress.toLowerCase() !== user.wallet.address.toLowerCase()) {
          console.log("Address mismatch! Trying to find correct account index...");

          // Try to find the correct account index
          const targetAddress = user.wallet.address.toLowerCase();
          let foundSigner = null;

          for (let i = 0; i < accounts.length; i++) {
            try {
              const testSigner = await provider.getSigner(i);
              const testAddress = await testSigner.getAddress();
              console.log(`Account ${i}: ${testAddress}`);

              if (testAddress.toLowerCase() === targetAddress) {
                foundSigner = testSigner;
                console.log(`✅ Found matching signer at index ${i}`);
                break;
              }
            } catch (indexError) {
              console.log(`Could not get signer for index ${i}:`, indexError);
            }
          }

          if (foundSigner) {
            signer = foundSigner;
          } else {
            console.log("Could not find matching signer, using default but will continue...");
          }
        }
      } catch (error) {
        console.error("Error creating signer:", error);
        throw new Error(`Could not create signer for address ${user.wallet.address}`);
      }

      const finalSignerAddress = await signer.getAddress();
      console.log("Final signer address:", finalSignerAddress);
      console.log("Expected address:", user.wallet.address);
      console.log("Addresses match:", finalSignerAddress.toLowerCase() === user.wallet.address.toLowerCase());
      console.log("=== END WALLET DEBUG ===");

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
  }, [ensureWalletConnected]);

  const acceptOffer = useCallback(async ({
    params,
    networkId,
    onProgress
  }: {
    params: AcceptOfferParams;
    networkId: string;
    onProgress: OnProgressCallback;
  }): Promise<AcceptOfferResult> => {
    if (!(await ensureWalletConnected())) {
      throw new Error("Please connect your wallet first");
    }

    try {
      // Parse chain ID from network ID
      const chainId = Number(parseCAIP10(networkId).chainId);

      // Switch to the correct network
      await walletClient.switchChain({ id: chainId });

      // Create signer using Privy's wallet provider
      if (!user?.wallet?.address) {
        throw new Error("No wallet connected");
      }

      // Get provider - for external wallets, use window.ethereum directly
      let privyProvider;

      if (user.wallet.getEthereumProvider) {
        // Embedded wallet
        privyProvider = await user.wallet.getEthereumProvider();
      } else {
        // External wallet - use window.ethereum
        privyProvider = window.ethereum;
      }

      const provider = new BrowserProvider(privyProvider);
      const signer = await provider.getSigner();

      // Verify the signer address matches the connected wallet
      const signerAddress = await signer.getAddress();
      console.log("Privy wallet address:", user.wallet.address);
      console.log("Signer address:", signerAddress);

      if (signerAddress.toLowerCase() !== user.wallet.address.toLowerCase()) {
        console.warn("Address mismatch! Using Privy wallet address as fallback");
      }

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
  }, [ensureWalletConnected]);

  const cancelOffer = useCallback(async ({
    params,
    networkId,
    onProgress
  }: {
    params: CancelOfferParams;
    networkId: string;
    onProgress: OnProgressCallback;
  }): Promise<CancelOfferResult> => {
    if (!(await ensureWalletConnected())) {
      throw new Error("Please connect your wallet first");
    }

    try {
      // Parse chain ID from network ID
      const chainId = Number(parseCAIP10(networkId).chainId);

      // Switch to the correct network
      await walletClient.switchChain({ id: chainId });

      // Create signer using Privy's wallet provider
      if (!user?.wallet?.address) {
        throw new Error("No wallet connected");
      }

      // Get provider - for external wallets, use window.ethereum directly
      let privyProvider;

      if (user.wallet.getEthereumProvider) {
        // Embedded wallet
        privyProvider = await user.wallet.getEthereumProvider();
      } else {
        // External wallet - use window.ethereum
        privyProvider = window.ethereum;
      }

      const provider = new BrowserProvider(privyProvider);
      const signer = await provider.getSigner();

      // Verify the signer address matches the connected wallet
      const signerAddress = await signer.getAddress();
      console.log("Privy wallet address:", user.wallet.address);
      console.log("Signer address:", signerAddress);

      if (signerAddress.toLowerCase() !== user.wallet.address.toLowerCase()) {
        console.warn("Address mismatch! Using Privy wallet address as fallback");
      }

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
  }, [ensureWalletConnected]);

  const buyListing = useCallback(async ({
    params,
    networkId,
    onProgress
  }: {
    params: BuyListingParams;
    networkId: string;
    onProgress: OnProgressCallback;
  }): Promise<BuyListingResult> => {
    if (!(await ensureWalletConnected())) {
      throw new Error("Please connect your wallet first");
    }

    try {
      // Parse chain ID from network ID
      const chainId = Number(parseCAIP10(networkId).chainId);

      // Switch to the correct network
      await walletClient.switchChain({ id: chainId });

      // Create signer using Privy's wallet provider
      if (!user?.wallet?.address) {
        throw new Error("No wallet connected");
      }

      // Get provider - for external wallets, use window.ethereum directly
      let privyProvider;

      if (user.wallet.getEthereumProvider) {
        // Embedded wallet
        privyProvider = await user.wallet.getEthereumProvider();
      } else {
        // External wallet - use window.ethereum
        privyProvider = window.ethereum;
      }

      const provider = new BrowserProvider(privyProvider);
      const signer = await provider.getSigner();

      // Verify the signer address matches the connected wallet
      const signerAddress = await signer.getAddress();
      console.log("Privy wallet address:", user.wallet.address);
      console.log("Signer address:", signerAddress);

      if (signerAddress.toLowerCase() !== user.wallet.address.toLowerCase()) {
        console.warn("Address mismatch! Using Privy wallet address as fallback");
      }

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
  }, [ensureWalletConnected]);

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
        {
          name: "Ether",
          symbol: "ETH",
          decimals: 18,
          contractAddress: "0x0000000000000000000000000000000000000000",
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
    isWalletConnected: !!user?.wallet?.address,
    walletAddress: user?.wallet?.address,
  };
}