"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Send,
  MoreVertical,
  Paperclip,
  Smile,
  Search,
  ArrowLeft,
  Check,
  CheckCheck,
  Clock,
  Wifi,
  WifiOff,
  MessageCircle,
  Users,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useXMTP } from "@/contexts/xmtp-context";
import { usePrivy } from "@privy-io/react-auth";
import { useToast } from "@/hooks/use-toast";
import { getDomainAvatarUrl, getConversationAvatarUrl } from "@/lib/avatar-utils";
import type { Dm } from "@xmtp/browser-sdk";

// Mock data for XMTP demonstration
const mockChats = [
  {
    id: "1",
    address: "0xC517cEe1ECb196fe94582D0208f9D3BEE2f563c2",
    lastMessage: "Hey, I'm interested in the monoplay01.ai domain. Is it still available?",
    timestamp: "2 min ago",
    unreadCount: 2,
    isOnline: true,
    avatar: null,
    messages: [
      {
        id: "1",
        text: "Hey, I'm interested in the monoplay01.ai domain. Is it still available?",
        sender: "user",
        timestamp: "2:30 PM",
        status: "delivered"
      },
      {
        id: "2",
        text: "Yes, it's still available! The current bid is 0.35 ETH. Would you like to make an offer?",
        sender: "me",
        timestamp: "2:31 PM",
        status: "read"
      },
      {
        id: "3",
        text: "What's your asking price? I'm looking to close this quickly.",
        sender: "user",
        timestamp: "2:32 PM",
        status: "delivered"
      }
    ]
  },
  {
    id: "2",
    address: "0xabcdef1234567890abcdef1234567890abcdef12",
    lastMessage: "Thanks for the domain! The transfer was smooth.",
    timestamp: "1 hour ago",
    unreadCount: 0,
    isOnline: false,
    avatar: null,
    messages: [
      {
        id: "1",
        text: "Hi, I saw your listing for crypto.io domain. Is it negotiable?",
        sender: "user",
        timestamp: "1:45 PM",
        status: "read"
      },
      {
        id: "2",
        text: "Hi! Yes, I'm open to reasonable offers. What's your budget?",
        sender: "me",
        timestamp: "1:46 PM",
        status: "read"
      },
      {
        id: "3",
        text: "I can offer 0.4 ETH. Would that work for you?",
        sender: "user",
        timestamp: "1:47 PM",
        status: "read"
      },
      {
        id: "4",
        text: "That sounds fair. Let's proceed with the transfer.",
        sender: "me",
        timestamp: "1:48 PM",
        status: "read"
      },
      {
        id: "5",
        text: "Thanks for the domain! The transfer was smooth.",
        sender: "user",
        timestamp: "1:50 PM",
        status: "read"
      }
    ]
  },
  {
    id: "3",
    address: "0x9876543210fedcba9876543210fedcba98765432",
    lastMessage: "Can we discuss the domain collection pricing?",
    timestamp: "3 hours ago",
    unreadCount: 1,
    isOnline: true,
    avatar: null,
    messages: [
      {
        id: "1",
        text: "Hi, I'm interested in your domain collection. Can we discuss pricing?",
        sender: "user",
        timestamp: "11:30 AM",
        status: "read"
      },
      {
        id: "2",
        text: "Absolutely! I have several domains in the collection. What type are you looking for?",
        sender: "me",
        timestamp: "11:31 AM",
        status: "read"
      },
      {
        id: "3",
        text: "Can we discuss the domain collection pricing?",
        sender: "user",
        timestamp: "11:32 AM",
        status: "delivered"
      }
    ]
  }
];

interface ChatInterfaceProps {
  contactAddress?: string | null;
  domainName?: string | null;
}

export function ChatInterface({ contactAddress, domainName }: ChatInterfaceProps) {
  const { client, isLoading, isInitialized, error, canMessage, initializeClient, revokeInstallations, clearLocalData } = useXMTP();
  const { authenticated, user } = usePrivy();
  const { toast } = useToast();

  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [newChatAddress, setNewChatAddress] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isStartingNewChat, setIsStartingNewChat] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [groupMembers, setGroupMembers] = useState("");
  const [groupName, setGroupName] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Domain_space deduplication utility
  const deduplicateConversations = useCallback((conversations: any[]) => {
    const seen = new Set();
    return conversations.filter(conv => {
      if (!conv || !conv.id) return false;
      if (seen.has(conv.id)) return false;
      seen.add(conv.id);
      return true;
    });
  }, []);

  // Domain_space approach - getPeerAddress utility
  const getPeerAddress = useCallback(async (conversation: Dm) => {
    try {
      // Method 1: Try peerInboxId approach (domain_space preferred method)
      const peerInboxId = await conversation.peerInboxId();
      if (peerInboxId && client) {
        const state = await client.preferences.inboxStateFromInboxIds([peerInboxId]);
        const address = state?.[0]?.identifiers?.[0]?.identifier;
        if (address && address.startsWith('0x') && address.length === 42) {
          return address;
        }
      }
    } catch (error) {
      console.log('peerInboxId method failed, trying members...', error);
    }

    try {
      // Method 2: Try members approach as fallback
      const members = await conversation.members();
      const address = (members?.[0] as { identifier?: string })?.identifier;
      if (address && address.startsWith('0x') && address.length === 42) {
        return address;
      }
    } catch (error) {
      console.log('members method failed', error);
    }

    return null; // Return null for invalid addresses
  }, [client]);

  // Load conversations - EXACT domain_space implementation
  const loadConversations = useCallback(async () => {
    if (!client) {
      console.log('No XMTP client available');
      return;
    }

    setIsRefreshing(true);
    try {
      console.log('🔄 Loading conversations (domain_space approach)...');

      // Force sync all conversations and messages like domain_space
      await client.conversations.syncAll();

      // Add delay to ensure sync completes like domain_space
      await new Promise(resolve => setTimeout(resolve, 200));

      // Load DMs with BOTH allowed and unknown consent states (CRITICAL for domain_space compatibility)
      console.log('🔄 Loading DMs with consent states...');
      const allConversations = await client.conversations.listDms();
      console.log('📬 Total conversations loaded:', allConversations.length);

      // Filter for DM conversations only, excluding group chats (domain_space approach)
      const dms = allConversations.filter((conv) =>
        'peerInboxId' in conv && typeof conv.peerInboxId === 'function'
      ) as Dm[];

      console.log('💬 DM conversations found:', dms.length);

      if (dms.length === 0) {
        console.log('📭 No DM conversations found');
        setConversations([]);
        return;
      }

      // Process each DM conversation (domain_space approach)
      console.log('🔄 Processing DM conversations...');
      const enhancedConversations = await Promise.all(
        dms.map(async (dm, index) => {
          try {
            console.log(`📝 Processing DM ${index + 1}/${dms.length}:`, dm.id);

            // Get peer address using domain_space utility
            const peerAddress = await getPeerAddress(dm);
            if (!peerAddress) {
              console.log(`❌ No valid peer address for DM ${index + 1} - skipping`);
              return null;
            }

            console.log(`✅ Valid DM ${index + 1} with peer:`, peerAddress);

            // Load messages like domain_space (with filtering for text messages)
            let messages = [];
            try {
              const msgs = await dm.messages();
              // Filter for text messages only like domain_space does
              messages = msgs.filter((msg: any) => {
                const isText = typeof msg.content === "string" &&
                              msg.content !== "" &&
                              !msg.content.startsWith("{") && // Filter out JSON system messages
                              !msg.content.includes("initiatedByInboxId"); // Filter out conversation creation messages
                return isText;
              });
              console.log(`📬 Loaded ${messages.length} text messages for DM ${index + 1}`);
            } catch (messageError) {
              console.warn(`❌ Failed to load messages for DM ${index + 1}:`, messageError);
            }

            const lastMessage = messages[messages.length - 1];

            return {
              id: dm.id,
              address: peerAddress,
              lastMessage: lastMessage?.content || "No messages yet",
              timestamp: lastMessage
                ? new Date(Number(lastMessage.sentAtNs) / 1_000_000).toLocaleTimeString()
                : "Now",
              unreadCount: 0, // Domain_space calculates this differently - we can enhance later
              isOnline: false,
              conversation: dm, // Store the original XMTP DM object
              isGroup: false,
              memberCount: undefined,
            };
          } catch (error) {
            console.error(`Error processing DM ${index + 1}:`, error);
            return null;
          }
        })
      );

      // Filter out null entries and sort by timestamp (domain_space approach)
      const validConversations = enhancedConversations
        .filter(Boolean)
        .sort((a, b) => {
          // Sort by most recent first
          const timeA = a.timestamp !== "Now" ? new Date(a.timestamp).getTime() : Date.now();
          const timeB = b.timestamp !== "Now" ? new Date(b.timestamp).getTime() : Date.now();
          return timeB - timeA;
        });

      console.log('✅ Successfully processed', validConversations.length, 'conversations');

      // Apply deduplication like domain_space
      const deduplicatedConversations = deduplicateConversations(validConversations);
      console.log('🔄 After deduplication:', deduplicatedConversations.length, 'conversations');

      setConversations(deduplicatedConversations);

      // Auto-select first conversation if none selected
      if (deduplicatedConversations.length > 0 && !selectedConversation) {
        setSelectedConversation(deduplicatedConversations[0]);
        console.log('🎯 Auto-selected first conversation:', deduplicatedConversations[0].address);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast({
        title: "Error Loading Conversations",
        description: "Failed to load your messages. Check console for details and try refreshing.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [client, selectedConversation, toast]);

  // Load messages for selected conversation
  const loadMessages = useCallback(async () => {
    if (!selectedConversation?.conversation) return;

    setIsLoadingMessages(true);
    try {
      const msgs = await selectedConversation.conversation.messages();

      const formattedMessages = msgs.map((msg: any) => {
        let messageText: string;

        if (typeof msg.content === "string") {
          messageText = msg.content;
        } else if (msg.content && typeof msg.content === "object") {
          // Handle system messages (group changes, etc.)
          if (msg.content.initiatedByInboxId) {
            messageText = "Group updated";
          } else if (msg.content.addedInboxes || msg.content.removedInboxes) {
            messageText = "Group membership changed";
          } else if (msg.content.metadataFieldChanges) {
            messageText = "Group metadata updated";
          } else {
            messageText = "System message";
          }
        } else {
          messageText = "Unknown message";
        }

        return {
          id: msg.id,
          text: messageText,
          sender: msg.senderAddress === user?.wallet?.address ? "me" : "user",
          timestamp: new Date(Number(msg.sentAtNs) / 1_000_000).toLocaleTimeString(),
          status: "delivered", // TODO: Implement message status
          senderAddress: msg.senderAddress,
        };
      });

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error Loading Messages",
        description: "Failed to load messages for this conversation.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingMessages(false);
    }
  }, [selectedConversation, user?.wallet?.address, toast]);

  // Send a message
  const handleSendMessage = useCallback(async () => {
    if (!messageInput.trim() || !selectedConversation?.conversation) return;

    try {
      console.log('Sending message:', messageInput);
      console.log('Conversation type:', selectedConversation.isGroup ? 'group' : 'dm');

      // Send message through XMTP
      await selectedConversation.conversation.send(messageInput);

      // Add message to local state immediately for better UX
      const newMessage = {
        id: Date.now().toString(),
        text: messageInput,
        sender: "me",
        timestamp: new Date().toLocaleTimeString(),
        status: "sent",
        senderAddress: user?.wallet?.address,
      };

      setMessages(prev => [...prev, newMessage]);
      setMessageInput("");

      // Update conversation's last message
      setConversations(prev =>
        prev.map(conv =>
          conv.id === selectedConversation.id
            ? {
                ...conv,
                lastMessage: messageInput,
                timestamp: new Date().toLocaleTimeString(),
              }
            : conv
        )
      );

      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);

      let errorMessage = "Failed to send your message. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes('network')) {
          errorMessage = "Network error. Please check your connection.";
        } else if (error.message.includes('not found')) {
          errorMessage = "Conversation not found. Please try refreshing.";
        }
      }

      toast({
        title: "Error Sending Message",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [messageInput, selectedConversation, user?.wallet?.address, toast]);

  // Validate if address can receive messages
  const validateAddress = useCallback(async (address: string): Promise<boolean> => {
    if (!client) return false;

    try {
      const identifier = {
        identifier: address.toLowerCase(),
        identifierKind: 'Ethereum' as const
      };

      const response = await client.canMessage([identifier]);
      return response.get(address.toLowerCase()) || false;
    } catch (error) {
      console.error('Error validating address:', error);
      return false;
    }
  }, [client]);

  // Start a new conversation
  const startNewConversation = useCallback(async () => {
    if (!client || !newChatAddress.trim()) return;

    setIsStartingNewChat(true);
    try {
      console.log('Validating address:', newChatAddress);

      // First, check if the address can receive messages
      const canMessage = await validateAddress(newChatAddress);

      if (!canMessage) {
        toast({
          title: "Address Not Reachable",
          description: "This address cannot receive XMTP messages. They need to enable XMTP first.",
          variant: "destructive",
        });
        return;
      }

      console.log('Address is valid, checking for existing conversation...');

      // Show validation feedback to user
      toast({
        title: "✅ Address is XMTP-enabled",
        description: "This address can receive messages. Creating conversation...",
      });

      // Check if conversation already exists
      const existingConv = findExistingConversation(newChatAddress);
      if (existingConv) {
        setSelectedConversation(existingConv);
        setNewChatAddress("");
        toast({
          title: "Conversation Found",
          description: "Opened existing conversation with this address.",
        });
        return;
      }

      console.log('Creating new DM conversation...');

      // Get inbox ID first (domainline approach)
      const identifier = {
        identifier: newChatAddress.toLowerCase(),
        identifierKind: 'Ethereum' as const,
      };

      const inboxId = await client.findInboxIdByIdentifier(identifier);

      if (!inboxId) {
        toast({
          title: "Error",
          description: "Failed to find inbox ID for this address.",
          variant: "destructive",
        });
        return;
      }

      console.log('Found inbox ID:', inboxId);

      // Create a DM conversation using inbox ID
      const conversation = await client.conversations.newDm(inboxId);

      const newConvo = {
        id: conversation.id,
        address: newChatAddress,
        lastMessage: "New conversation started",
        timestamp: new Date().toLocaleTimeString(),
        unreadCount: 0,
        isOnline: false,
        conversation,
        isGroup: false, // Explicitly mark as DM
        memberCount: undefined,
      };

      setConversations(prev => [newConvo, ...prev]);
      setSelectedConversation(newConvo);
      setNewChatAddress("");

      toast({
        title: "Conversation Created! 💬",
        description: `Started messaging with ${newChatAddress.slice(0, 6)}...${newChatAddress.slice(-4)}`,
      });
    } catch (error) {
      console.error('Error starting conversation:', error);

      let errorMessage = "Failed to start conversation. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes('not found') || error.message.includes('invalid')) {
          errorMessage = "Invalid Ethereum address. Please check and try again.";
        } else if (error.message.includes('network')) {
          errorMessage = "Network error. Please check your connection.";
        }
      }

      toast({
        title: "Error Starting Conversation",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsStartingNewChat(false);
    }
  }, [client, newChatAddress, validateAddress, toast]);

  // Create a new group conversation
  const createGroupConversation = useCallback(async () => {
    if (!client || !groupMembers.trim()) return;

    setIsCreatingGroup(true);
    try {
      console.log('Creating group conversation...');

      // Parse member addresses
      const memberAddresses = groupMembers
        .split(',')
        .map(addr => addr.trim().toLowerCase())
        .filter(addr => addr.length > 0);

      if (memberAddresses.length === 0) {
        toast({
          title: "No Members",
          description: "Please add at least one member address.",
          variant: "destructive",
        });
        return;
      }

      // Validate all member addresses
      console.log('Validating member addresses:', memberAddresses);
      const identifiers = memberAddresses.map(addr => ({
        identifier: addr,
        identifierKind: 'Ethereum' as const
      }));

      const canMessageResponse = await client.canMessage(identifiers);
      const unreachableMembers = memberAddresses.filter(
        addr => !canMessageResponse.get(addr)
      );

      if (unreachableMembers.length > 0) {
        toast({
          title: "Some Members Not Reachable",
          description: `These addresses cannot receive XMTP messages: ${unreachableMembers.map(addr => addr.slice(0, 6) + '...').join(', ')}`,
          variant: "destructive",
        });
        return;
      }

      // Get inbox IDs for the members
      console.log('Getting inbox IDs for members...');
      const memberInboxIds = await Promise.all(
        memberAddresses.map(async (addr) => {
          // For now, we'll use the address as inbox ID
          // In a real implementation, you'd need to resolve the inbox ID
          return addr;
        })
      );

      console.log('Creating group with members:', memberInboxIds);

      // Create the group
      const group = await client.conversations.newGroup(
        memberInboxIds,
        {
          name: groupName.trim() || `Group Chat`,
          description: `Group chat created by ${user?.wallet?.address?.slice(0, 6)}...`,
        }
      );

      const newConvo = {
        id: group.id,
        address: `Group: ${groupName || 'Unnamed'}`,
        lastMessage: "Group chat created",
        timestamp: new Date().toLocaleTimeString(),
        unreadCount: 0,
        isOnline: true,
        conversation: group,
        isGroup: true,
        memberCount: memberAddresses.length + 1, // +1 for creator
      };

      setConversations(prev => [newConvo, ...prev]);
      setSelectedConversation(newConvo);
      setGroupMembers("");
      setGroupName("");

      toast({
        title: "Group Created! 🎉",
        description: `Created group with ${memberAddresses.length} member(s)`,
      });
    } catch (error) {
      console.error('Error creating group:', error);

      let errorMessage = "Failed to create group. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes('too many')) {
          errorMessage = "Group size limit exceeded. Maximum 250 members allowed.";
        } else if (error.message.includes('invalid')) {
          errorMessage = "Invalid member address. Please check addresses and try again.";
        } else if (error.message.includes('network')) {
          errorMessage = "Network error. Please check your connection.";
        }
      }

      toast({
        title: "Error Creating Group",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsCreatingGroup(false);
    }
  }, [client, groupMembers, groupName, user?.wallet?.address, toast]);

  // Conversation helper methods
  const getConversationById = useCallback(async (conversationId: string) => {
    if (!client) return null;
    try {
      return await client.conversations.getConversationById(conversationId);
    } catch (error) {
      console.error('Error getting conversation by ID:', error);
      return null;
    }
  }, [client]);

  const getMessageById = useCallback(async (messageId: string) => {
    if (!client) return null;
    try {
      return await client.conversations.getMessageById(messageId);
    } catch (error) {
      console.error('Error getting message by ID:', error);
      return null;
    }
  }, [client]);

  const getDmByInboxId = useCallback(async (peerInboxId: string) => {
    if (!client) return null;
    try {
      return await client.conversations.getDmByInboxId(peerInboxId);
    } catch (error) {
      console.error('Error getting DM by inbox ID:', error);
      return null;
    }
  }, [client]);

  // Find existing conversation with an address
  const findExistingConversation = useCallback((address: string) => {
    return conversations.find(conv =>
      !conv.isGroup && conv.address.toLowerCase() === address.toLowerCase()
    );
  }, [conversations]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Load conversations when client is ready
  useEffect(() => {
    if (isInitialized && client) {
      loadConversations();
    }
  }, [isInitialized, client, loadConversations]);

  // Auto-populate contact address from URL params
  useEffect(() => {
    if (contactAddress && contactAddress.startsWith('0x')) {
      setNewChatAddress(contactAddress);

      // If we have a domain name, show a helpful toast
      if (domainName) {
        toast({
          title: "Ready to Message",
          description: `You can now message the owner of ${domainName}`,
        });
      }
    }
  }, [contactAddress, domainName, toast]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      loadMessages();
    }
  }, [selectedConversation, loadMessages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const filteredConversations = conversations.filter(conv =>
    conv.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Check className="w-3 h-3 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-[#A259FF]" />;
      default:
        return <Clock className="w-3 h-3 text-gray-400" />;
    }
  };

  // Show wallet connection prompt if not authenticated
  if (!authenticated) {
    return (
      <div className="flex h-[calc(100vh-120px)] bg-[#2b2b2b] text-white items-center justify-center">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 text-[#A259FF]" />
          <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-white/60 mb-6">
            Connect your wallet to start messaging with other users on the XMTP network.
          </p>
        </div>
      </div>
    );
  }

  // Show XMTP loading state
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-120px)] bg-[#2b2b2b] text-white items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A259FF] mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-white mb-2">Setting Up XMTP</h2>
          <p className="text-white/60 mb-4">
            Please sign the message in your wallet to enable messaging...
          </p>
          <p className="text-sm text-white/40">
            This creates your XMTP identity and allows you to send/receive messages.
          </p>
        </div>
      </div>
    );
  }

  // Show XMTP setup prompt
  if (!isInitialized && !isLoading) {
    return (
      <div className="flex h-[calc(100vh-120px)] bg-[#2b2b2b] text-white items-center justify-center">
        <div className="text-center max-w-md">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 text-[#A259FF]" />
          <h2 className="text-2xl font-bold text-white mb-2">Enable Messaging</h2>
          <p className="text-white/60 mb-6">
            To start messaging other users, you need to set up your XMTP identity.
            This requires a one-time signature to create your messaging account.
          </p>
          <div className="bg-[#3b3b3b] rounded-lg p-4 mb-6 text-left">
            <h3 className="text-sm font-semibold text-[#A259FF] mb-2">What happens next:</h3>
            <ul className="text-sm text-white/80 space-y-1">
              <li>• Your wallet will ask you to sign a message</li>
              <li>• This creates your XMTP identity (free)</li>
              <li>• You can then message any Ethereum address</li>
              <li>• Your messages are end-to-end encrypted</li>
            </ul>
          </div>
          <Button
            onClick={initializeClient}
            className="bg-[#A259FF] hover:bg-[#A259FF]/90 text-white px-8 py-3 rounded-[20px] font-semibold"
          >
            Set Up Messaging
          </Button>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    const isInstallationLimitError = error.includes('10/10') || error.includes('Installation limit');

    return (
      <div className="flex h-[calc(100vh-120px)] bg-[#2b2b2b] text-white items-center justify-center">
        <div className="text-center max-w-md">
          <WifiOff className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold text-white mb-2">
            {isInstallationLimitError ? "Installation Limit Reached" : "Connection Error"}
          </h2>
          <p className="text-white/60 mb-6">
            {error}
          </p>

          {isInstallationLimitError ? (
            <div className="space-y-3">
              <div className="bg-[#3b3b3b] rounded-lg p-4 mb-4 text-left">
                <h3 className="text-sm font-semibold text-[#A259FF] mb-2">Quick fixes:</h3>
                <ul className="text-sm text-white/80 space-y-1">
                  <li>• Clear browser data (recommended)</li>
                  <li>• Use incognito/private mode</li>
                  <li>• Try a different browser</li>
                  <li>• Clear local XMTP data</li>
                </ul>
              </div>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={clearLocalData}
                  className="bg-[#A259FF] hover:bg-[#A259FF]/90 text-white px-6 py-2 rounded-[20px]"
                >
                  Clear Local Data
                </Button>
                <Button
                  onClick={initializeClient}
                  variant="outline"
                  className="border-[#A259FF] text-[#A259FF] hover:bg-[#A259FF] hover:text-white px-6 py-2 rounded-[20px]"
                >
                  Retry Connection
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={initializeClient}
              className="bg-[#A259FF] hover:bg-[#A259FF]/90 text-white px-8 py-3 rounded-[20px] font-semibold"
            >
              Retry Connection
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-120px)] bg-[#2b2b2b] text-white overflow-hidden">
      {/* Sidebar - Chat List */}
      <div className="w-1/3 lg:w-1/4 border-r border-[#A259FF]/20 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#A259FF]/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#A259FF]">Messages</h1>
              {isInitialized && <Wifi className="w-4 h-4 text-green-500" />}
              <Button
                onClick={loadConversations}
                size="sm"
                variant="ghost"
                disabled={isRefreshing}
                className="text-white/60 hover:text-[#A259FF] hover:bg-[#A259FF]/20 p-1 h-auto disabled:opacity-50"
                title={isRefreshing ? "Refreshing conversations..." : "Refresh conversations"}
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>

          {/* New Chat Input */}
          <div className="mb-4 space-y-3">
            {/* DM Creation */}
            <div>
              <label className="text-xs text-white/60 mb-1 block">Start DM</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter wallet address..."
                  value={newChatAddress}
                  onChange={(e) => setNewChatAddress(e.target.value)}
                  className="bg-[#3b3b3b] border-[#A259FF]/30 text-white placeholder:text-white/60 focus:border-[#A259FF] flex-1 text-sm"
                />
                <Button
                  onClick={startNewConversation}
                  disabled={!newChatAddress.trim() || isStartingNewChat}
                  size="sm"
                  className="bg-[#A259FF] hover:bg-[#A259FF]/90"
                >
                  {isStartingNewChat ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <MessageCircle className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Group Creation */}
            <div>
              <label className="text-xs text-white/60 mb-1 block">Create Group</label>
              <div className="space-y-2">
                <Input
                  placeholder="Group name (optional)"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="bg-[#3b3b3b] border-[#A259FF]/30 text-white placeholder:text-white/60 focus:border-[#A259FF] text-sm"
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="Member addresses (comma separated)..."
                    value={groupMembers}
                    onChange={(e) => setGroupMembers(e.target.value)}
                    className="bg-[#3b3b3b] border-[#A259FF]/30 text-white placeholder:text-white/60 focus:border-[#A259FF] flex-1 text-sm"
                  />
                  <Button
                    onClick={createGroupConversation}
                    disabled={!groupMembers.trim() || isCreatingGroup}
                    size="sm"
                    className="bg-[#A259FF] hover:bg-[#A259FF]/90"
                  >
                    {isCreatingGroup ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Users className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#3b3b3b] border-[#A259FF]/30 text-white placeholder:text-white/60 focus:border-[#A259FF]"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-white/40" />
              <p className="text-white/60 text-sm">
                No conversations yet. Start a new chat above!
              </p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.id}
                className={cn(
                  "flex items-center p-4 border-b border-[#A259FF]/10 cursor-pointer hover:bg-[#3b3b3b]/50 transition-colors",
                  selectedConversation?.id === conv.id && "bg-[#3b3b3b]"
                )}
                onClick={() => setSelectedConversation(conv)}
              >
                <div className="relative mr-3">
                  <Avatar className="w-12 h-12">
                    <img
                      src={getConversationAvatarUrl(conv.address, { size: 48 })}
                      alt={`${conv.address} avatar`}
                      className="w-full h-full rounded-full object-cover"
                    />
                    <AvatarFallback className="bg-[#A259FF] text-white">
                      {conv.address.slice(2, 4).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#2b2b2b]",
                    conv.isOnline ? "bg-green-500" : "bg-gray-500"
                  )} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                      {conv.isGroup && <Users className="w-3 h-3 text-[#A259FF] flex-shrink-0" />}
                      <h3 className="text-sm font-semibold text-white truncate font-mono">
                        {conv.isGroup
                          ? conv.address
                          : `${conv.address.slice(0, 6)}...${conv.address.slice(-4)}`
                        }
                      </h3>
                    </div>
                    <span className="text-xs text-white/60">{conv.timestamp}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <p className="text-sm text-white/80 truncate">
                        {typeof conv.lastMessage === "string" ? conv.lastMessage : "System message"}
                      </p>
                      {conv.isGroup && conv.memberCount && (
                        <span className="text-xs text-white/40 flex-shrink-0">
                          {conv.memberCount} members
                        </span>
                      )}
                    </div>
                    {conv.unreadCount > 0 && (
                      <div className="ml-2 bg-[#A259FF] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {conv.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-[#A259FF]/20 bg-[#3b3b3b]/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="md:hidden text-white/60 hover:text-white hover:bg-white/10 mr-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>

                  <div className="relative mr-3">
                    <Avatar className="w-10 h-10">
                      <img
                        src={getConversationAvatarUrl(selectedConversation.address, { size: 40 })}
                        alt={`${selectedConversation.address} avatar`}
                        className="w-full h-full rounded-full object-cover"
                      />
                      <AvatarFallback className="bg-[#A259FF] text-white">
                        {selectedConversation.address.slice(2, 4).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#2b2b2b]",
                      selectedConversation.isOnline ? "bg-green-500" : "bg-gray-500"
                    )} />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-white font-mono">
                      {selectedConversation.address.slice(0, 6)}...{selectedConversation.address.slice(-4)}
                    </h2>
                    <p className="text-sm text-white/60">
                      XMTP • {selectedConversation.isOnline ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {isLoadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A259FF]"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-white/40" />
                    <p className="text-white/60">
                      No messages yet. Start the conversation!
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.sender === "me" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-xs lg:max-w-md px-4 py-2 rounded-[20px]",
                        message.sender === "me"
                          ? "bg-[#A259FF] text-white"
                          : "bg-[#3b3b3b] text-white"
                      )}
                    >
                      <p className="text-sm break-words">
                        {typeof message.text === "string" ? message.text : "Invalid message"}
                      </p>
                      <div className="flex items-center justify-end mt-1 space-x-1">
                        <span className="text-xs opacity-70">{message.timestamp}</span>
                        {message.sender === "me" && (
                          <div className="ml-1">
                            {getMessageStatusIcon(message.status)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input - Fixed at Bottom */}
            <div className="p-4 border-t border-[#A259FF]/20 bg-[#3b3b3b]/50 mt-auto">
              <div className="flex items-center space-x-3">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white/60 hover:text-white hover:bg-white/10 rounded-full p-2"
                >
                  <Paperclip className="w-5 h-5" />
                </Button>

                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="bg-[#2b2b2b] border-[#A259FF]/30 text-white placeholder:text-white/60 focus:border-[#A259FF] rounded-[25px] pr-12 h-12 text-base"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white hover:bg-white/10 rounded-full p-1"
                  >
                    <Smile className="w-5 h-5" />
                  </Button>
                </div>

                <Button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="bg-[#A259FF] hover:bg-[#A259FF]/90 text-white rounded-full p-3 disabled:opacity-50 h-12 w-12"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          // No conversation selected
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-white/40" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Select a conversation
              </h3>
              <p className="text-white/60">
                Choose a conversation from the sidebar or start a new one.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
