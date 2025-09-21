import { ChatInterface } from "@/components/messaging/chat-interface";

export default function Messages() {
  return (
    <main className=" bg-[#2b2b2b] text-white">
      <ChatInterface />
    </main>
  )
}

// Disable static generation for interactive components
export const dynamic = 'force-dynamic'
