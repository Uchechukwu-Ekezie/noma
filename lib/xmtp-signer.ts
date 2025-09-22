/**
 * XMTP Signer Integration with Privy
 * Creates an EOA signer for XMTP using Privy wallet
 */

import type { Signer, Identifier } from '@xmtp/browser-sdk';
import type { User } from '@privy-io/react-auth';

// Extend window interface for ethereum provider
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params: any[] }) => Promise<any>;
    };
  }
}

/**
 * Convert hex string to Uint8Array
 */
function hexToBytes(hex: string): Uint8Array {
  // Remove '0x' prefix if present
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
  }
  return bytes;
}

/**
 * Create XMTP EOA signer from Privy user
 */
export function createXMTPSigner(
  user: User,
  signMessage: (message: string) => Promise<string>
): Signer | null {
  if (!user?.wallet?.address) {
    return null;
  }

  const accountIdentifier: Identifier = {
    identifier: user.wallet.address.toLowerCase(),
    identifierKind: 'Ethereum',
  };

  const signer: Signer = {
    type: 'EOA',
    getIdentifier: () => accountIdentifier,
    signMessage: async (message: string): Promise<Uint8Array> => {
      try {
        console.log('Signing message for XMTP with Privy...');

        // Use Privy's signMessage method
        const signature = await signMessage(message);

        // Convert hex signature to Uint8Array
        return hexToBytes(signature);
      } catch (error) {
        console.error('Error signing message for XMTP:', error);

        if (error instanceof Error) {
          if (error.message.includes('rejected') || error.message.includes('denied')) {
            throw new Error('Signature rejected. Please approve the signature to enable messaging.');
          } else if (error.message.includes('embedded wallet')) {
            throw new Error('Please use a supported wallet for signing.');
          }
        }

        throw new Error('Failed to sign message for XMTP.');
      }
    },
  };

  return signer;
}

/**
 * Validate if user can create XMTP signer
 */
export function canCreateXMTPSigner(user: User | null): boolean {
  return !!(user?.wallet?.address);
}