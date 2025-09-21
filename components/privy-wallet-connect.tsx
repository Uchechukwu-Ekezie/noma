"use client";

import { Button } from "@/components/ui/button";
import { Wallet, LogOut, Copy, User } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function PrivyWalletConnect() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { toast } = useToast();
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);

  const handleConnect = () => {
    console.log("Attempting to connect...");
    login();
  };

  // Show success toast when wallet is connected
  useEffect(() => {
    if (ready && authenticated && user?.wallet?.address && !hasShownSuccessToast) {
      toast({
        title: "Wallet successfully connected!",
        description: `Connected to ${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`,
      });
      setHasShownSuccessToast(true);
    }

    // Reset toast flag when disconnected
    if (!authenticated) {
      setHasShownSuccessToast(false);
    }
  }, [ready, authenticated, user?.wallet?.address, hasShownSuccessToast, toast]);

  const handleCopyAddress = async () => {
    if (user?.wallet?.address) {
      await navigator.clipboard.writeText(user.wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Address copied to clipboard!",
      });
    }
  };

  const handleDisconnect = () => {
    logout();
    setShowMenu(false);
    toast({
      title: "Wallet disconnected",
    });
  };

  console.log("Privy state:", {
    ready,
    authenticated,
    user: user?.wallet?.address,
  });

  if (!ready) {
    return (
      <Button
        disabled
        className="bg-[#A259FF] text-white px-6 py-2 rounded-[20px] font-semibold hover:bg-[#A259FF]/90 transition-colors"
      >
        <Wallet className="w-4 h-4 mr-2" />
        Loading...
      </Button>
    );
  }

  if (!authenticated) {
    return (
      <Button
        onClick={handleConnect}
        className="bg-[#A259FF] text-white px-6 py-2 rounded-[20px] font-semibold hover:bg-[#A259FF]/90 transition-colors"
      >
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button
        onClick={() => setShowMenu(!showMenu)}
        className="bg-[#A259FF] text-white px-6 py-2 rounded-[20px] font-semibold hover:bg-[#A259FF]/90 transition-colors"
      >
        <User className="w-4 h-4 mr-2" />
        {user?.wallet?.address
          ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(
              -4
            )}`
          : "Connected"}
      </Button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-56 bg-[#2b2b2b] border border-[#A259FF]/20 rounded-md shadow-lg z-50">
          <div className="py-1">
            <button
              onClick={handleCopyAddress}
              className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-[#A259FF]/10"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? "Copied!" : "Copy Address"}
            </button>

            <button className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-[#A259FF]/10">
              <User className="w-4 h-4 mr-2" />
              View Profile
            </button>

            <hr className="my-1 border-[#A259FF]/20" />

            <button
              onClick={handleDisconnect}
              className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
