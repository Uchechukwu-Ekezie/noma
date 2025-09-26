"use client";

/**
 * Environment Test Component
 * Add this temporarily to any page to check if environment variables are loading correctly
 */

export function EnvTest() {
  const envVars = {
    NEXT_PUBLIC_DOMA_API_KEY: process.env.NEXT_PUBLIC_DOMA_API_KEY,
    NEXT_PUBLIC_DOMA_URL: process.env.NEXT_PUBLIC_DOMA_URL,
    NEXT_PUBLIC_DOMA_GRAPHQL_URL: process.env.NEXT_PUBLIC_DOMA_GRAPHQL_URL,
    NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID,
  };

  const maskValue = (key: string, value: string | undefined) => {
    if (!value) return "NOT SET";
    if (key.includes('API_KEY') || key.includes('APP_ID')) {
      return `${value.substring(0, 10)}...`;
    }
    return value;
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-md text-xs">
      <h3 className="font-bold mb-2 text-green-400">🔍 Environment Check</h3>
      <div className="space-y-1">
        {Object.entries(envVars).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="text-gray-300">{key.replace('NEXT_PUBLIC_', '')}:</span>
            <span className={value ? "text-green-400" : "text-red-400"}>
              {maskValue(key, value)}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 pt-2 border-t border-gray-600 text-xs text-gray-400">
        Remove this component in production
      </div>
    </div>
  );
}