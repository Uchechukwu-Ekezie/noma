/**
 * Environment Variables Check
 * Run this script to verify your environment configuration
 */

console.log("🔍 Environment Variables Check");
console.log("===============================");

const requiredEnvVars = [
  'NEXT_PUBLIC_DOMA_API_KEY',
  'NEXT_PUBLIC_DOMA_URL',
  'NEXT_PUBLIC_DOMA_GRAPHQL_URL',
  'NEXT_PUBLIC_PRIVY_APP_ID',
  'NEXT_PUBLIC_APP_NAME'
];

const optionalEnvVars = [
  'NEXT_PUBLIC_PROJECT_ID'
];

console.log("\n✅ Required Environment Variables:");
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? "✅" : "❌";
  const displayValue = value ?
    (varName.includes('API_KEY') ? `${value.substring(0, 10)}...` : value) :
    "NOT SET";

  console.log(`${status} ${varName}: ${displayValue}`);
});

console.log("\n📝 Optional Environment Variables:");
optionalEnvVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? "✅" : "⚠️";
  const displayValue = value || "NOT SET";

  console.log(`${status} ${varName}: ${displayValue}`);
});

console.log("\n🔗 API Configuration Check:");
console.log("- Doma API Base URL:", process.env.NEXT_PUBLIC_DOMA_URL || "https://api-testnet.doma.xyz");
console.log("- GraphQL Endpoint:", process.env.NEXT_PUBLIC_DOMA_GRAPHQL_URL || "https://api-testnet.doma.xyz/graphql");
console.log("- App Name:", process.env.NEXT_PUBLIC_APP_NAME || "noma-marketplace");

// Check if API key format is correct
const apiKey = process.env.NEXT_PUBLIC_DOMA_API_KEY;
if (apiKey) {
  const isValidFormat = apiKey.startsWith('v1.');
  console.log(`- API Key Format: ${isValidFormat ? "✅ Valid" : "❌ Invalid (should start with 'v1.')"}`);
}

console.log("\n💡 Notes:");
console.log("- Make sure your .env.local file exists and contains all required variables");
console.log("- Environment variables should be prefixed with NEXT_PUBLIC_ for client-side access");
console.log("- Restart your development server after changing environment variables");

console.log("\n===============================");
console.log("Environment check complete!");