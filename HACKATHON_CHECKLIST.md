# Hackathon Submission Checklist — Noma

Use this checklist during your live demo and when submitting the project.

## Before the demo
- [ ] Set `NEXT_PUBLIC_PRIVY_APP_ID` in `.env.local` with a valid Privy app id.
- [ ] Run `rm -rf .next && npm run dev` and confirm the site loads.
- [ ] Verify the XMTP debug panel works and can send/receive messages.
- [ ] Prepare two wallets (embedded or external) for messaging demo.

## Demo steps (recommended order)
1. Show home/marketplace — highlight domain discovery.
2. Sign in with Privy — demonstrate embedded wallet creation.
3. Link an external wallet (e.g., MetaMask) and show address.
4. Use `XmtpDebugPanel` to send a message from one account to another.
5. Create a listing or place an order on the orderbook — show the transaction flow.
6. Show analytics or portfolio page with holdings.
7. Final slide: roadmap + how to get involved.

## Acceptance criteria for submission
- [ ] App runs locally on a clean checkout following README instructions.
- [ ] Authentication and wallet connection are demonstrated.
- [ ] Messaging (XMTP) is functioning and visible in the debug panel.
- [ ] A listing or orderbook action is performed during the demo.

## Quick troubleshooting
- If page fails to load: clear `.next` and restart dev server.
- If Privy login fails: check `NEXT_PUBLIC_PRIVY_APP_ID` and network connectivity.
- If XMTP errors emerge: check browser console for errors and ensure local wallets are unlocked.
