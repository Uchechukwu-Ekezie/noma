"use client";

import { ChatInterface } from "@/components/messaging/chat-interface";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function MessagesPageContent() {
  const searchParams = useSearchParams();
  const contactAddress = searchParams.get('contact');
  const domainName = searchParams.get('domain');

  return (
    <div className="min-h-screen bg-[#2b2b2b]">
      <ChatInterface contactAddress={contactAddress} domainName={domainName} />
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#2b2b2b]">Loading...</div>}>
      <MessagesPageContent />
    </Suspense>
  );
}

// Disable static generation for real-time messaging
export const dynamic = 'force-dynamic';