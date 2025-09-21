"use client";

import { useState, useRef, useEffect } from "react";
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
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

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

export function ChatInterface() {
  const [selectedChat, setSelectedChat] = useState(mockChats[0]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat.messages]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // In a real app, this would send the message via API
      console.log("Sending message:", messageInput);
      setMessageInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredChats = mockChats.filter(chat =>
    chat.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
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

  return (
    <div className="flex h-[calc(105vh-120px)] bg-[#2b2b2b] text-white overflow-hidden">
      {/* Sidebar - Chat List */}
      <div className="w-1/5 border-r border-[#A259FF]/20 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#A259FF]/20">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-[#A259FF]">Messages</h1>
            <Button
              size="sm"
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#3b3b3b] border-[#A259FF]/30 text-white placeholder:text-white/60 focus:border-[#A259FF]"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "flex items-center p-4 border-b border-[#A259FF]/10 cursor-pointer hover:bg-[#3b3b3b]/50 transition-colors",
                selectedChat.id === chat.id && "bg-[#3b3b3b]"
              )}
              onClick={() => setSelectedChat(chat)}
            >
              <div className="relative mr-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={chat.avatar || undefined} />
                  <AvatarFallback className="bg-[#A259FF] text-white">
                    {chat.address.slice(2, 4).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className={cn(
                  "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#2b2b2b]",
                  chat.isOnline ? "bg-green-500" : "bg-gray-500"
                )} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-white truncate font-mono">
                    {chat.address.slice(0, 6)}...{chat.address.slice(-4)}
                  </h3>
                  <span className="text-xs text-white/60">{chat.timestamp}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/80 truncate">
                    {chat.lastMessage}
                  </p>
                  {chat.unreadCount > 0 && (
                    <div className="ml-2 bg-[#A259FF] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {chat.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
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
                  <AvatarImage src={selectedChat.avatar || undefined} />
                  <AvatarFallback className="bg-[#A259FF] text-white">
                    {selectedChat.address.slice(2, 4).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className={cn(
                  "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#2b2b2b]",
                  selectedChat.isOnline ? "bg-green-500" : "bg-gray-500"
                )} />
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-white font-mono">
                  {selectedChat.address.slice(0, 6)}...{selectedChat.address.slice(-4)}
                </h2>
                <p className="text-sm text-white/60">
                  {selectedChat.isOnline ? "Online" : "Offline"}
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
          {selectedChat.messages.map((message) => (
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
                <p className="text-sm">{message.text}</p>
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
          ))}
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
      </div>
    </div>
  );
}
