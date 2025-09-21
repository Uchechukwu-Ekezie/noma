"use client";

import { PrivyProvider } from "@privy-io/react-auth";

export function PrivyProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
          createOnLogin: "users-without-wallets",
          requireUserPasswordOnCreate: true,
        },
        mfa: {
          noPromptOnMfaRequired: false,
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
