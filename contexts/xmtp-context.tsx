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

      // First check if user can message (has existing identity)
      const canMessage = await Client.canMessage([identifier]);

      let xmtpClient;

      if (canMessage.get(user.wallet.address.toLowerCase())) {
        console.log('Found existing XMTP identity, building client...');
        // User has existing identity, build client without signing
        xmtpClient = await Client.build(identifier, {
          env: 'dev',
        });
      } else {
        console.log('No existing identity found, creating new one (requires signature)...');
        // Create new identity - this will trigger signing
        xmtpClient = await Client.create(signer, {
          env: 'dev',
        });
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

      if (error instanceof Error) {
        if (error.message.includes('User rejected') || error.message.includes('denied')) {
          errorMessage = 'Signature required to enable messaging. Please try again and approve the signature.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else {
          errorMessage = error.message;
        }
      }

      setError(errorMessage);

      toast({
        title: "XMTP Setup Failed",
        description: errorMessage,
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