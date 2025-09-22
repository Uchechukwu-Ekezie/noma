/**
 * Doma GraphQL Client Configuration
 * Connects to Doma Subgraph API for real domain data
 */

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export class DomaGraphQLClient {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl?: string, apiKey?: string) {
    this.baseUrl = baseUrl || "https://api-testnet.doma.xyz/graphql";
    this.apiKey = apiKey;
  }

  async request<T>(
    query: string,
    variables?: Record<string, any>
  ): Promise<T> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(this.apiKey && { "Api-Key": this.apiKey }),
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`GraphQL request failed with status ${response.status}`);
    }

    const result: GraphQLResponse<T> = await response.json();

    if (result.errors && result.errors.length > 0) {
      throw new Error(result.errors.map((e) => e.message).join("; "));
    }

    if (!result.data) {
      throw new Error("No data returned from GraphQL query");
    }

    return result.data;
  }
}

// Create default client instance
export const domaClient = new DomaGraphQLClient(
  process.env.NEXT_PUBLIC_DOMA_GRAPHQL_URL,
  process.env.NEXT_PUBLIC_DOMA_API_KEY
);