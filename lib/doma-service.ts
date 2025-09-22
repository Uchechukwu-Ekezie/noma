/**
 * Doma Domain Data Service
 * Service layer for fetching domain data from Doma Subgraph API
 */

import { domaClient } from "./doma-client";
import {
  GET_NAMES,
  GET_NAME,
  GET_LISTINGS,
  GET_OFFERS,
  GET_NAME_STATISTICS,
  GET_NAME_ACTIVITIES,
  GET_TOKEN_ACTIVITIES,
} from "./doma-queries";
import type {
  NameModel,
  PaginatedNamesResponse,
  PaginatedNameListingsResponse,
  PaginatedNameOffersResponse,
  PaginatedNameActivitiesResponse,
  PaginatedTokenActivitiesResponse,
  NameStatisticsModel,
  NamesQueryParams,
  ListingsQueryParams,
  OffersQueryParams,
  NameActivitiesQueryParams,
  TokenActivitiesQueryParams,
} from "../types/doma";

class DomaService {
  /**
   * Get paginated list of tokenized names
   */
  async getNames(params: NamesQueryParams = {}): Promise<PaginatedNamesResponse> {
    const {
      skip = 0,
      take = 20,
      ownedBy,
      claimStatus = "ALL",
      name,
      networkIds,
      registrarIanaIds,
      tlds,
      sortOrder = "DESC",
    } = params;

    const response = await domaClient.request<{ names: PaginatedNamesResponse }>(
      GET_NAMES,
      {
        skip,
        take,
        ownedBy,
        claimStatus,
        name,
        networkIds,
        registrarIanaIds,
        tlds,
        sortOrder,
      }
    );

    return response.names;
  }

  /**
   * Get information about a specific tokenized name
   */
  async getName(name: string): Promise<NameModel> {
    const response = await domaClient.request<{ name: NameModel }>(GET_NAME, {
      name,
    });

    return response.name;
  }

  /**
   * Get paginated list of "Buy Now" secondary sale listings
   */
  async getListings(params: ListingsQueryParams = {}): Promise<PaginatedNameListingsResponse> {
    const {
      skip = 0,
      take = 20,
      tlds,
      createdSince,
      sld,
      networkIds,
      registrarIanaIds,
    } = params;

    const response = await domaClient.request<{ listings: PaginatedNameListingsResponse }>(
      GET_LISTINGS,
      {
        skip,
        take,
        tlds,
        createdSince,
        sld,
        networkIds,
        registrarIanaIds,
      }
    );

    return response.listings;
  }

  /**
   * Get paginated list of offers for tokenized names
   */
  async getOffers(params: OffersQueryParams = {}): Promise<PaginatedNameOffersResponse> {
    const {
      tokenId,
      offeredBy,
      skip = 0,
      take = 20,
      status = "ACTIVE",
      sortOrder = "DESC",
    } = params;

    const response = await domaClient.request<{ offers: PaginatedNameOffersResponse }>(
      GET_OFFERS,
      {
        tokenId,
        offeredBy,
        skip,
        take,
        status,
        sortOrder,
      }
    );

    return response.offers;
  }

  /**
   * Get statistics for a specific tokenized name
   */
  async getNameStatistics(tokenId: string): Promise<NameStatisticsModel> {
    const response = await domaClient.request<{ nameStatistics: NameStatisticsModel }>(
      GET_NAME_STATISTICS,
      { tokenId }
    );

    return response.nameStatistics;
  }

  /**
   * Get paginated list of activities related to a specific name
   */
  async getNameActivities(
    params: NameActivitiesQueryParams
  ): Promise<PaginatedNameActivitiesResponse> {
    const {
      name,
      skip = 0,
      take = 20,
      type,
      sortOrder = "DESC",
    } = params;

    const response = await domaClient.request<{
      nameActivities: PaginatedNameActivitiesResponse;
    }>(GET_NAME_ACTIVITIES, {
      name,
      skip,
      take,
      type,
      sortOrder,
    });

    return response.nameActivities;
  }

  /**
   * Get paginated list of activities related to a specific token
   */
  async getTokenActivities(
    params: TokenActivitiesQueryParams
  ): Promise<PaginatedTokenActivitiesResponse> {
    const {
      tokenId,
      skip = 0,
      take = 20,
      type,
      sortOrder = "DESC",
    } = params;

    const response = await domaClient.request<{
      tokenActivities: PaginatedTokenActivitiesResponse;
    }>(GET_TOKEN_ACTIVITIES, {
      tokenId,
      skip,
      take,
      type,
      sortOrder,
    });

    return response.tokenActivities;
  }

  /**
   * Search domains by name with pagination
   */
  async searchDomains(
    query: string,
    params: Omit<NamesQueryParams, "name"> = {}
  ): Promise<PaginatedNamesResponse> {
    return this.getNames({
      ...params,
      name: query,
    });
  }

  /**
   * Get domains by category (using TLD filter)
   */
  async getDomainsByCategory(
    category: string,
    params: Omit<NamesQueryParams, "tlds"> = {}
  ): Promise<PaginatedNamesResponse> {
    // Map categories to TLDs
    const categoryTldMap: Record<string, string[]> = {
      tech: ["tech", "io", "ai", "app"],
      crypto: ["crypto", "eth", "coin"],
      defi: ["defi", "swap", "yield"],
      nft: ["nft", "art", "gallery"],
      gaming: ["game", "games", "play"],
      business: ["com", "biz", "corp"],
      all: [], // No filter for all
    };

    const tlds = categoryTldMap[category.toLowerCase()] || [];

    return this.getNames({
      ...params,
      tlds: tlds.length > 0 ? tlds : undefined,
    });
  }

  /**
   * Get trending domains (recently listed or with recent activity)
   */
  async getTrendingDomains(limit: number = 10): Promise<NameModel[]> {
    const response = await this.getListings({
      take: limit,
      createdSince: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
    });

    // Convert listings to names (simplified)
    return response.items.map((listing) => ({
      name: listing.name,
      expiresAt: listing.nameExpiresAt,
      tokenizedAt: listing.createdAt,
      eoi: false,
      claimedBy: listing.offererAddress,
      registrar: listing.registrar,
      nameservers: [],
      tokens: [
        {
          tokenId: listing.tokenId,
          networkId: listing.chain.networkId,
          ownerAddress: listing.offererAddress,
          type: "OWNERSHIP" as const,
          tokenAddress: listing.tokenAddress,
          explorerUrl: "",
          expiresAt: listing.nameExpiresAt,
          createdAt: listing.createdAt,
          chain: listing.chain,
          listings: [
            {
              id: listing.id,
              externalId: listing.externalId,
              price: listing.price,
              offererAddress: listing.offererAddress,
              orderbook: listing.orderbook,
              expiresAt: listing.expiresAt,
              createdAt: listing.createdAt,
              updatedAt: listing.updatedAt,
              currency: listing.currency,
            },
          ],
        },
      ],
      activities: [],
    }));
  }

  /**
   * Get recently listed domains
   */
  async getRecentlyListedDomains(limit: number = 20): Promise<NameModel[]> {
    return this.getTrendingDomains(limit);
  }

  /**
   * Get domains owned by a specific address
   */
  async getOwnedDomains(
    address: string,
    params: Omit<NamesQueryParams, "ownedBy"> = {}
  ): Promise<PaginatedNamesResponse> {
    // Convert address to CAIP-10 format (assuming Ethereum mainnet)
    const caip10Address = address.startsWith("eip155:")
      ? address
      : `eip155:1:${address}`;

    return this.getNames({
      ...params,
      ownedBy: [caip10Address],
    });
  }
}

// Export singleton instance
export const domaService = new DomaService();