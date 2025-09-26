# Deploying Noma (Vercel / Netlify)

This document explains how to deploy the `doma` app for the hackathon.

## Vercel (recommended)
1. Create a Vercel project and connect the GitHub repo.
2. Set environment variables in the Vercel dashboard (Project > Settings > Environment Variables):
   - `NEXT_PUBLIC_PRIVY_APP_ID` — your Privy app id
   - `NEXT_PUBLIC_API_BASE` — API base URL if required
3. Use the default build command `npm run build` and output directory `.next`.
4. Deploy. If build warnings appear regarding `esmExternals`, you can remove that experimental flag from `next.config.mjs`.

## Netlify
Netlify can host Next.js with adapter-based configuration; Vercel is simpler for Next apps.

## Environment variables
- `NEXT_PUBLIC_PRIVY_APP_ID` (required)
- `NEXT_PUBLIC_API_BASE` (optional, for API calls)

## Post-deploy checklist
- Confirm the root page loads and the provider initializes.
- Test sign-in via Privy on the deployed domain.
- Test XMTP messaging between two accounts.

## Troubleshooting
- If your deployment fails due to SSR-only modules, make sure to guard browser-specific code with `use client` and dynamic imports where needed.
- If builds fail due to peer dependency issues, pin package versions or resolve conflicts in `package.json` before deploying.
