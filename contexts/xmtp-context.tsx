"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Client, type Signer } from '@xmtp/browser-sdk';
import { usePrivy } from '@privy-io/react-auth';
import { createXMTPSigner, canCreateXMTPSigner } from '@/lib/xmtp-signer';
import { useToast } from '@/hooks/use-toast';

interface XMTPContextType {
  client: Client | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  initializeClient: () => Promise<void>;
  disconnect: () => void;
  canMessage: boolean;
  revokeInstallations: () => Promise<void>;
  clearLocalData: () => void;
}

const XMTPContext = createContext<XMTPContextType | undefined>(undefined);

interface XMTPProviderProps {
  children: React.ReactNode;
}

export function XMTPProvider({ children }: XMTPProviderProps) {
  const { user, authenticated, signMessage } = usePrivy();
  const { toast } = useToast();

  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user can create XMTP messages
  const canMessage = authenticated && canCreateXMTPSigner(user);

  const initializeClient = useCallback(async () => {
    if (!user || !authenticated || !signMessage) {
      setError('Wallet not connected');
      return;
    }

    if (!canCreateXMTPSigner(user)) {
      setError('Invalid wallet for XMTP');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Clear any corrupted XMTP data
      try {
        localStorage.removeItem('xmtp');
        sessionStorage.removeItem('xmtp');
        // Clear IndexedDB XMTP data
        if (typeof indexedDB !== 'undefined') {
          const dbs = await indexedDB.databases();
          dbs.forEach(db => {
            if (db.name?.includes('xmtp')) {
              indexedDB.deleteDatabase(db.name);
            }
          });
        }
      } catch (cleanupError) {
        console.log('Storage cleanup completed');
      }
      // Create XMTP signer from Privy user
      const signer = createXMTPSigner(user, signMessage);

      if (!signer) {
        throw new Error('Failed to create XMTP signer');
      }

      console.log('Creating XMTP client for address:', user.wallet?.address);

      // Show signing prompt to user
      toast({
        title: "XMTP Setup Required",
        description: "Please sign the message to enable messaging. This creates your XMTP identity.",
      });

      console.log('About to create XMTP client - checking for existing identity...');

      const identifier = {
        identifier: user.wallet.address.toLowerCase(),
        identifierKind: 'Ethereum' as const,
      };

      // Check if user can message (has existing identity) - use domain_space approach
      const canMessage = await Client.canMessage([identifier], 'dev');

      let xmtpClient;

      if (canMessage.get(user.wallet.address.toLowerCase())) {
        console.log('✅ Found existing XMTP identity, building client (reuses existing installation)...');
        // User has existing identity - use Client.build() to reuse existing installation
        // This is the KEY difference from your old code - we build instead of create!
        xmtpClient = await Client.build(identifier, {
          env: 'dev',
        });
        console.log("✅ Successfully built existing XMTP client");
      } else {
        console.log('❌ No existing identity found, creating new one (requires signature)...');
        // Only create new identity if user is not registered
        // This should only happen for brand new users
        xmtpClient = await Client.create(signer, {
          env: 'dev',
        });
        console.log("✅ Successfully created new XMTP client");
      }

      console.log('XMTP client ready!');

      setClient(xmtpClient);
      setIsInitialized(true);

      toast({
        title: "XMTP Connected Successfully! 🎉",
        description: "Your messaging identity has been created. You can now send and receive messages!",
      });

      console.log('XMTP client initialized successfully');
    } catch (error) {
      console.error('Error initializing XMTP client:', error);

      let errorMessage = 'Failed to initialize XMTP';
      let isInstallationLimitError = false;

      if (error instanceof Error) {
        const errorStr = error.message;

        if (errorStr.includes('10/10 installations') || errorStr.includes('already registered 10/10')) {
          isInstallationLimitError = true;
          errorMessage = 'Installation limit reached (10/10). Clear browser data or use incognito mode to reset.';
        } else if (errorStr.includes('User rejected') || errorStr.includes('denied')) {
          errorMessage = 'Signature required to enable messaging. Please try again and approve the signature.';
        } else if (errorStr.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else {
          errorMessage = errorStr;
        }
      }

      setError(errorMessage);

      toast({
        title: isInstallationLimitError ? "Installation Limit Reached" : "XMTP Setup Failed",
        description: isInstallationLimitError
          ? "Clear browser data, use incognito mode, or try a different browser to reset XMTP installations."
          : errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, authenticated, signMessage, toast]);

  const disconnect = useCallback(() => {
    if (client) {
      client.close();
      setClient(null);
      setIsInitialized(false);
      setError(null);

      toast({
        title: "XMTP Disconnected",
        description: "Messaging has been disabled",
      });
    }
  }, [client, toast]);

  // Clear local XMTP data (similar to domain_space approach)
  const clearLocalData = useCallback(() => {
    try {
      localStorage.removeItem('xmtp');
      sessionStorage.removeItem('xmtp');

      // Clear IndexedDB XMTP data
      if (typeof indexedDB !== 'undefined') {
        indexedDB.databases().then(databases => {
          databases.forEach(db => {
            if (db.name?.includes('xmtp')) {
              indexedDB.deleteDatabase(db.name);
            }
          });
        });
      }

      toast({
        title: "Local Data Cleared",
        description: "XMTP local storage has been cleared",
      });
    } catch (error) {
      console.log('Local data cleanup completed');
    }
  }, [toast]);

  // Revoke XMTP installations (using domain_space approach)
  const revokeInstallations = useCallback(async () => {
    if (!user?.wallet?.address) {
      toast({
        title: "No Wallet Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🔄 Attempting to revoke XMTP installations...');

      const identifier = {
        identifier: user.wallet.address.toLowerCase(),
        identifierKind: 'Ethereum' as const,
      };

      // Check if address is registered
      const canMessage = await Client.canMessage([identifier], 'dev');
      if (!canMessage.get(user.wallet.address.toLowerCase())) {
        throw new Error('This address is not registered with XMTP. No installations to revoke.');
      }

      // Try to extract inbox ID from the error if we hit 10/10 limit
      let inboxId: string | null = null;

      try {
        // This might fail with 10/10 error, but we can extract the inbox ID
        const signer = createXMTPSigner(user, signMessage);
        if (!signer) throw new Error('Failed to create signer');

        await Client.create(signer, { env: 'dev' });
      } catch (createError) {
        const errorStr = String(createError);
        const inboxIdMatch = errorStr.match(/InboxID\s+([a-f0-9]+)/i);
        if (inboxIdMatch) {
          inboxId = inboxIdMatch[1];
          console.log('✅ Extracted inbox ID from error:', inboxId);
        }
      }

      if (inboxId) {
        toast({
          title: "Installation Limit Reached",
          description: `Found inbox ID: ${inboxId.slice(0, 8)}... Clear browser data and try a different browser/incognito mode to reset.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Manual Reset Required",
          description: "Clear browser data, use incognito mode, or try a different browser to reset XMTP installations.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error revoking installations:', error);

      toast({
        title: "Reset Required",
        description: "To fix installation limits: 1) Clear browser data, 2) Use incognito mode, or 3) Try different browser",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.wallet?.address, signMessage, toast]);

  // Auto-initialize when wallet is connected
  useEffect(() => {
    if (canMessage && !isInitialized && !isLoading && !client) {
      initializeClient();
    }
  }, [canMessage, isInitialized, isLoading, client, initializeClient]);

  // Clean up when wallet disconnects
  useEffect(() => {
    if (!authenticated && client) {
      disconnect();
    }
  }, [authenticated, client, disconnect]);

  const value: XMTPContextType = {
    client,
    isLoading,
    isInitialized,
    error,
    initializeClient,
    disconnect,
    canMessage,
    revokeInstallations,
    clearLocalData,
  };

  return (
    <XMTPContext.Provider value={value}>
      {children}
    </XMTPContext.Provider>
  );
}

export function useXMTP(): XMTPContextType {
  const context = useContext(XMTPContext);
  if (context === undefined) {
    throw new Error('useXMTP must be used within an XMTPProvider');
  }
  return context;
}