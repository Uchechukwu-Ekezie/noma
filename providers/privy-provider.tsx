"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { QueryProvider } from "./query-provider";
import { XMTPProvider } from "@/contexts/xmtp-context";

export function PrivyProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <PrivyProvider
        appId={
          process.env.NEXT_PUBLIC_PRIVY_APP_ID || "cmflanjor001nk10bxkfvokri"
        }
        config={{
          loginMethods: ["wallet", "email", "sms"],
          appearance: {
            theme: "dark",
            accentColor: "#A259FF",
            logo: "/noma_logo.svg",
          },
          embeddedWallets: {
            createOnLogin: "off",
            requireUserPasswordOnCreate: false,
          },
          mfa: {
            noPromptOnMfaRequired: false,
          },
        }}
      >
        <XMTPProvider>{children}</XMTPProvider>
      </PrivyProvider>
    </QueryProvider>
  );
}
