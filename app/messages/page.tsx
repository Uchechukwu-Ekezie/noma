"use client";

import { ChatInterface } from "@/components/messaging/chat-interface";

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-[#2b2b2b]">
      <ChatInterface />
    </div>
  );
}

// Disable static generation for real-time messaging
export const dynamic = 'force-dynamic';