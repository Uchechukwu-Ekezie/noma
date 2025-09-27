"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Zap, Clock, Info } from "lucide-react";
import { useOrderbook } from "@/hooks/use-orderbook";
import { parseUnits } from "ethers";
import { toast } from "sonner";
import type { NameModel } from "@/types/doma";
import type { CurrencyToken, OrderbookType } from "@doma-protocol/orderbook-sdk";

interface OfferPopupProps {
  isOpen: boolean;
  onClose: () => void;
  domain: NameModel;
}

export function OfferPopup({ isOpen, onClose, domain }: OfferPopupProps) {
  const [offerAmount, setOfferAmount] = useState("");
  const [offerType, setOfferType] = useState<"instant" | "make-offer">("instant");
  const [expirationDays, setExpirationDays] = useState("7");
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyToken | null>(null);
  const [supportedCurrencies, setSupportedCurrencies] = useState<CurrencyToken[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [orderbootFee, setOrderbootFee] = useState(0.025);
  const [marketplaceFees, setMarketplaceFees] = useState<any[]>([]);

  const {
    createOffer,
    buyListing,
    getSupportedCurrencies,
    getOrderbookFee,
    isWalletConnected,
    walletAddress
  } = useOrderbook();

  // Get the primary token and listing
  const primaryToken = domain.tokens && domain.tokens.length > 0 ? domain.tokens[0] : null;
  const primaryListing = primaryToken?.listings?.[0];

  // Load supported currencies and fees on component mount
  useEffect(() => {
    console.log("useEffect triggered - isOpen:", isOpen, "primaryToken:", primaryToken);
    if (isOpen && primaryToken) {
      const loadData = async () => {
        try {
          // Get network ID from token
          const networkId = primaryToken.chain?.networkId || primaryToken.networkId;
          console.log("Network ID:", networkId);

          if (!networkId) {
            console.error("No network ID found on token");
            toast.error("Invalid network configuration");
            return;
          }

          // Load supported currencies using the new API format
          if (primaryListing) {
            console.log("Loading currencies for networkId:", networkId);
            const currencyResponse = await getSupportedCurrencies({
              chainId: networkId,
              orderbook: primaryListing.orderbook,
              contractAddress: primaryToken.tokenAddress
            });

            console.log("Loaded currencies response:", currencyResponse);

            // Extract currencies from response - handle both formats
            const currencies = currencyResponse.currencies || currencyResponse.data || [];
            console.log("Extracted currencies:", currencies);

            // Ensure currencies is an array and filter ones with contract addresses
            const validCurrencies = Array.isArray(currencies) ?
              currencies.filter(c => c && c.contractAddress) : [];
            console.log("Valid currencies:", validCurrencies);
            setSupportedCurrencies(validCurrencies);

            // Set default currency (USDC if available, otherwise first one)
            const defaultCurrency = validCurrencies.find(c => c.symbol === "USDC") || validCurrencies[0];
            console.log("Default currency selected:", defaultCurrency);
            setSelectedCurrency(defaultCurrency);

            // Load orderbook fee using the new API format
            try {
              const feeResponse = await getOrderbookFee({
                chainId: networkId,
                contractAddress: primaryToken.tokenAddress,
                orderbook: primaryListing.orderbook
              });

              console.log("Fee response:", feeResponse);
              // Extract fees from response - handle both formats
              const fees = feeResponse.marketplaceFees || feeResponse.data || [];
              console.log("Extracted fees:", fees);

              // Store the actual fee objects for use in the offer
              setMarketplaceFees(fees);

              // Also store the percentage for display
              const feePercentage = fees.length > 0 ? fees[0].basisPoints / 10000 : 0.025;
              setOrderbootFee(feePercentage);
            } catch (feeError) {
              console.warn("Failed to load orderbook fee, using empty fees:", feeError);
              setOrderbootFee(0.025); // Default 2.5% fee for display
              setMarketplaceFees([]); // Empty fees array like domain_space
            }
          } else {
            console.log("No primary listing found - loading fallback currencies and trying to get fees anyway");

            // Even without listing, try to get fees for the token
            try {
              const feeResponse = await getOrderbookFee({
                chainId: networkId,
                contractAddress: primaryToken.tokenAddress,
                orderbook: "DOMA" // Default orderbook when no listing
              });

              console.log("Fee response (no listing):", feeResponse);
              const fees = feeResponse.marketplaceFees || feeResponse.data || [];
              console.log("Extracted fees (no listing):", fees);

              setMarketplaceFees(fees);
              const feePercentage = fees.length > 0 ? fees[0].basisPoints / 10000 : 0.025;
              setOrderbootFee(feePercentage);
            } catch (feeError) {
              console.warn("Failed to load fees without listing, using empty array:", feeError);
              setMarketplaceFees([]); // Empty fees like domain_space does
              setOrderbootFee(0.025);
            }

            // Use fallback currencies (remove ETH with null address - might cause issues)
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
            setSupportedCurrencies(fallbackCurrencies);
            setSelectedCurrency(fallbackCurrencies[0]);
          }
        } catch (error) {
          console.error("Error loading offer data:", error);
          toast.error("Failed to load offer configuration");

          // Use fallback currencies and empty fees on error (like domain_space)
          setMarketplaceFees([]); // Empty fees array
          setOrderbootFee(0.025); // Default fee for display

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
          setSupportedCurrencies(fallbackCurrencies);
          setSelectedCurrency(fallbackCurrencies[0]);
        }
      };

      loadData();
    }
  }, [isOpen, primaryToken, primaryListing, getSupportedCurrencies, getOrderbookFee]);

  const formatPrice = (price: string, decimals: number = 18): string => {
    try {
      const ethPrice = parseInt(price) / Math.pow(10, decimals);
      return ethPrice.toFixed(3);
    } catch {
      return "0.000";
    }
  };

  const handleSubmit = async () => {
    console.log("=== SUBMIT OFFER CLICKED ===");
    console.log("isWalletConnected:", isWalletConnected);
    console.log("primaryToken:", primaryToken);
    console.log("offerType:", offerType);
    console.log("offerAmount:", offerAmount);
    console.log("selectedCurrency:", selectedCurrency);
    console.log("primaryListing:", primaryListing);

    if (!isWalletConnected) {
      console.log("❌ Wallet not connected");
      toast.error("Please connect your wallet first");
      return;
    }

    if (!primaryToken) {
      console.log("❌ No primary token");
      toast.error("No token information available");
      return;
    }

    if (offerType === "make-offer") {
      if (!offerAmount || !selectedCurrency) {
        console.log("❌ Missing offer amount or currency");
        toast.error("Please enter an offer amount and select a currency");
        return;
      }

      // For make offer, we don't strictly need a listing, but we need basic token info
      if (!primaryToken.tokenAddress || !primaryToken.tokenId) {
        console.log("❌ Missing token address or ID");
        toast.error("Missing token information");
        return;
      }
    }

    console.log("✅ All validations passed, starting submission...");
    setIsLoading(true);

    try {
      if (offerType === "instant") {
        // Handle instant buy (buy listing)
        if (!primaryListing) {
          toast.error("No listing available for instant purchase");
          return;
        }

        console.log("🚀 Starting instant buy process...");

        // Get network ID from token - handle both string and number formats
        const networkId = primaryToken.chain?.networkId || primaryToken.networkId;
        console.log("networkId:", networkId);

        if (!networkId) {
          toast.error("Invalid network configuration");
          return;
        }

        const params = {
          orderId: primaryListing.externalId,
        };

        console.log("📋 Buy listing params:", params);
        console.log("📞 Calling buyListing...");

        const result = await buyListing({
          params,
          networkId,
          onProgress: (progress) => {
            progress.forEach((step) => {
              console.log("📈 Progress:", step.description);
              toast.info(step.description);
            });
          },
        });

        console.log("✅ Purchase completed successfully!", result);
        toast.success("Purchase completed successfully!");

        // Close popup and potentially refresh offers list
        onClose();
      } else {
        // Handle make offer
        console.log("🚀 Starting make offer process...");

        // Get network ID from token - handle both string and number formats
        const networkId = primaryToken.chain?.networkId || primaryToken.networkId;
        console.log("networkId:", networkId);

        if (!networkId) {
          toast.error("Invalid network configuration");
          return;
        }

        const durationMs = parseInt(expirationDays) * 24 * 60 * 60 * 1000; // Convert days to milliseconds
        console.log("durationMs:", durationMs);

        // Use the actual marketplace fees from the API (like domain_space does)
        console.log("🏦 Using marketplace fees from API:", marketplaceFees);
        console.log("🏦 Number of fees:", marketplaceFees.length);
        console.log("🏦 Fee structure:", JSON.stringify(marketplaceFees, null, 2));

        // Validate marketplace fees structure (like domain_space validation)
        const validatedMarketplaceFees = marketplaceFees.filter(fee =>
          fee && typeof fee.basisPoints === 'number' && fee.basisPoints > 0
        );
        console.log("🔍 Validated marketplace fees:", validatedMarketplaceFees);

        // Use API fees if available, otherwise use REQUIRED fee recipients
        let finalMarketplaceFees;

        if (validatedMarketplaceFees.length > 0) {
          console.log("🏦 Using marketplace fees from API");
          finalMarketplaceFees = validatedMarketplaceFees;
        } else {
          console.log("🏦 Using REQUIRED marketplace fee recipients (API returned empty)");
          // These are the required fee recipients from the error message
          finalMarketplaceFees = [
            {
              recipient: "0x2E7cC63800e77BB8c662c45Ef33D1cCc23861532",
              basisPoints: 250, // 2.5% - standard marketplace fee
            },
            {
              recipient: "0x5318579e61A7a6cD71A8fd163C1A6794b2695E2b",
              basisPoints: 250, // 2.5% - protocol fee
            }
          ];
        }

        console.log("🔧 Final marketplace fees to use:", finalMarketplaceFees);

        const params = {
          items: [{
            contract: primaryToken.tokenAddress,
            tokenId: primaryToken.tokenId,
            price: parseUnits(offerAmount, selectedCurrency!.decimals).toString(),
            currencyContractAddress: selectedCurrency!.contractAddress,
            duration: durationMs,
          }],
          orderbook: (primaryListing?.orderbook || "DOMA") as OrderbookType,
          source: "zephyra-marketplace",
          marketplaceFees: finalMarketplaceFees, // Use final fees (API or required)
        };

        console.log("📋 Offer params:", params);
        console.log("💰 Price calculation:", {
          offerAmount,
          decimals: selectedCurrency!.decimals,
          parsedPrice: parseUnits(offerAmount, selectedCurrency!.decimals).toString()
        });

        // Validate the offer item structure
        const offerItem = params.items[0];
        console.log("🔍 Offer item validation:", {
          contract: offerItem.contract,
          tokenId: offerItem.tokenId,
          price: offerItem.price,
          priceAsNumber: BigInt(offerItem.price).toString(),
          currencyContractAddress: offerItem.currencyContractAddress,
          duration: offerItem.duration,
          isValidPrice: BigInt(offerItem.price) > 0n
        });

        // Additional validation
        if (!offerItem.contract || !offerItem.tokenId) {
          throw new Error("Missing contract or tokenId");
        }
        if (BigInt(offerItem.price) <= 0n) {
          throw new Error("Price must be greater than 0");
        }
        if (!offerItem.currencyContractAddress) {
          throw new Error("Missing currency contract address");
        }

        console.log("📞 Calling createOffer with detailed params...");
        console.log("🔍 Full params object:", JSON.stringify(params, null, 2));
        console.log("🌐 NetworkId:", networkId);
        console.log("💰 Selected currency details:", {
          currency: selectedCurrency,
          symbol: selectedCurrency!.symbol,
          contractAddress: selectedCurrency!.contractAddress,
          decimals: selectedCurrency!.decimals,
          hasContractAddress: !!selectedCurrency!.contractAddress
        });
        console.log("🔗 Has WETH offer:", selectedCurrency!.symbol?.toLowerCase() === "weth");
        console.log("💱 Supported currencies count:", supportedCurrencies.length);

        const result = await createOffer({
          params,
          networkId,
          onProgress: (progress) => {
            progress.forEach((step) => {
              console.log("📈 Progress:", step.description, "Status:", step.status);
              toast.info(`${step.description} - ${step.status}`);
            });
          },
          hasWethOffer: selectedCurrency!.symbol?.toLowerCase() === "weth",
          currencies: supportedCurrencies
        });

        console.log("✅ Offer created successfully!", result);
        toast.success("Offer created successfully!");

        // Close popup and potentially refresh offers list
        onClose();
      }
    } catch (error: any) {
      console.error("❌ Error submitting offer:", error);
      console.error("❌ Error details:", {
        message: error.message,
        code: error.code,
        cause: error.cause,
        stack: error.stack,
        full: error
      });

      // Extract more meaningful error messages
      let errorMessage = "Failed to submit offer";

      if (error.message) {
        errorMessage = error.message;
      }

      if (error.cause?.message) {
        errorMessage += ` (${error.cause.message})`;
      }

      // Check for specific error types
      if (error.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient funds to complete the offer";
      } else if (error.message?.includes("user rejected")) {
        errorMessage = "Transaction was cancelled by user";
      } else if (error.message?.includes("network")) {
        errorMessage = "Network error - please check your connection and try again";
      } else if (error.message?.includes("API")) {
        errorMessage = "API error - please try again later";
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative bg-[#2b2b2b] border border-[#A259FF]/20 rounded-lg p-6 mx-4 max-w-md w-full">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white"
        >
          ✕
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">
            {offerType === "instant" ? "Buy Instantly" : "Make Offer"} - {domain.name}
          </h2>
        </div>

        <div className="space-y-6">
          {/* Wallet Connection Warning */}
          {!isWalletConnected && (
            <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-orange-500" />
                <p className="text-sm font-medium text-orange-400">
                  Please connect your wallet to make offers
                </p>
              </div>
            </div>
          )}

          {/* Offer Type Selection */}
          <div className="grid w-full grid-cols-2 bg-[#3b3b3b] rounded-lg p-1">
            <button
              onClick={() => setOfferType("instant")}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                offerType === "instant"
                  ? "bg-[#A259FF] text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Zap className="h-4 w-4" />
              Buy Instant
            </button>
            <button
              onClick={() => setOfferType("make-offer")}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                offerType === "make-offer"
                  ? "bg-[#A259FF] text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Clock className="h-4 w-4" />
              Make Offer
            </button>
          </div>

          {/* Current Price Display */}
          {primaryListing && offerType === "instant" && (
            <div className="bg-[#3b3b3b] p-4 rounded-lg border border-[#A259FF]/20">
              <p className="text-sm text-white/60 mb-2">Current Price</p>
              <p className="text-2xl font-bold text-[#A259FF]">
                {formatPrice(primaryListing.price, primaryListing.currency.decimals)}{" "}
                {primaryListing.currency.symbol}
              </p>
              {primaryListing.currency.usdExchangeRate && (
                <p className="text-sm text-white/60 mt-1">
                  ~${(parseFloat(formatPrice(primaryListing.price, primaryListing.currency.decimals)) * primaryListing.currency.usdExchangeRate).toFixed(2)} USD
                </p>
              )}
            </div>
          )}

          {/* Currency Selection */}
          {offerType === "make-offer" && (
            <div className="space-y-2">
              <label htmlFor="currency" className="text-sm font-medium leading-none text-white">Currency</label>
              <select
                id="currency"
                value={selectedCurrency?.symbol || ""}
                onChange={(e) => {
                  const currency = supportedCurrencies.find(c => c.symbol === e.target.value);
                  setSelectedCurrency(currency || null);
                }}
                className="flex h-10 w-full rounded-md border border-[#A259FF]/20 bg-[#3b3b3b] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#A259FF]"
              >
                {(!Array.isArray(supportedCurrencies) || supportedCurrencies.length === 0) && (
                  <option value="">Loading currencies...</option>
                )}
                {Array.isArray(supportedCurrencies) && supportedCurrencies.map((currency) => (
                  <option key={currency.symbol} value={currency.symbol}>
                    {currency.symbol} - {currency.name}
                  </option>
                ))}
              </select>
              {/* Debug info */}
              <p className="text-xs text-white/60">
                Debug: {Array.isArray(supportedCurrencies) ? supportedCurrencies.length : 0} currencies loaded, selected: {selectedCurrency?.symbol || "none"}
              </p>
            </div>
          )}

          {/* Expiration */}
          {offerType === "make-offer" && (
            <div className="space-y-2">
              <label htmlFor="expiration" className="text-sm font-medium leading-none text-white">Duration</label>
              <select
                id="expiration"
                value={expirationDays}
                onChange={(e) => setExpirationDays(e.target.value)}
                className="flex h-10 w-full rounded-md border border-[#A259FF]/20 bg-[#3b3b3b] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#A259FF]"
              >
                <option value="1">24 hours</option>
                <option value="3">3 days</option>
                <option value="7">7 days</option>
              </select>
            </div>
          )}

          {/* Offer Amount */}
          {offerType === "make-offer" && (
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium leading-none text-white">Offer Amount</label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                className="bg-[#3b3b3b] border-[#A259FF]/20 text-white placeholder:text-white/60"
              />
            </div>
          )}

          {/* Fees Information */}
          {offerType === "make-offer" && (
            <div className="bg-[#A259FF]/10 border border-[#A259FF]/30 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-[#A259FF]" />
                <p className="text-sm font-medium text-white">Marketplace Fees</p>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">Platform Fee</span>
                <span className="text-white">{(orderbootFee * 100).toFixed(2)}%</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => {
                console.log("🔘 Submit button clicked!");
                handleSubmit();
              }}
              disabled={isLoading || !isWalletConnected || (offerType === "make-offer" && (!offerAmount || !selectedCurrency))}
              className="flex-1 bg-[#A259FF] hover:bg-[#A259FF]/90 text-white disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Processing...
                </>
              ) : (
                offerType === "instant" ? "Buy Now" : "Submit Offer"
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => console.log("Send message to owner")}
              title="Send Message"
              className="border-[#A259FF]/30 text-[#A259FF] hover:bg-[#A259FF]/10"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}