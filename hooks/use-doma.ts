/**
 * React hooks for Doma domain data fetching
 * Uses React Query for caching, background updates, and optimistic updates
 */

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { domaService } from "../lib/doma-service";
import type {
  NamesQueryParams,
  ListingsQueryParams,
  OffersQueryParams,
  NameActivitiesQueryParams,
  TokenActivitiesQueryParams,
} from "../types/doma";

// Query key factories
export const domaQueryKeys = {
  all: ["doma"] as const,
  names: () => [...domaQueryKeys.all, "names"] as const,
  namesList: (params: NamesQueryParams) => [...domaQueryKeys.names(), "list", params] as const,
  name: (name: string) => [...domaQueryKeys.names(), "detail", name] as const,
  nameStats: (tokenId: string) => [...domaQueryKeys.names(), "stats", tokenId] as const,
  listings: () => [...domaQueryKeys.all, "listings"] as const,
  listingsList: (params: ListingsQueryParams) => [...domaQueryKeys.listings(), "list", params] as const,
  offers: () => [...domaQueryKeys.all, "offers"] as const,
  offersList: (params: OffersQueryParams) => [...domaQueryKeys.offers(), "list", params] as const,
  activities: () => [...domaQueryKeys.all, "activities"] as const,
  nameActivities: (params: NameActivitiesQueryParams) => [...domaQueryKeys.activities(), "names", params] as const,
  tokenActivities: (params: TokenActivitiesQueryParams) => [...domaQueryKeys.activities(), "tokens", params] as const,
};

/**
 * Hook to fetch paginated names with infinite scroll support
 */
export function useNames(params: NamesQueryParams = {}) {
  return useInfiniteQuery({
    queryKey: domaQueryKeys.namesList(params),
    queryFn: ({ pageParam = 0 }) =>
      domaService.getNames({
        ...params,
        skip: pageParam,
        take: params.take || 20,
      }),
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage
        ? lastPage.currentPage * lastPage.pageSize
        : undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to search domains with infinite scroll
 */
export function useSearchDomains(query: string, params: Omit<NamesQueryParams, "name"> = {}) {
  return useInfiniteQuery({
    queryKey: domaQueryKeys.namesList({ ...params, name: query }),
    queryFn: ({ pageParam = 0 }) =>
      domaService.searchDomains(query, {
        ...params,
        skip: pageParam,
        take: params.take || 20,
      }),
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage
        ? lastPage.currentPage * lastPage.pageSize
        : undefined;
    },
    initialPageParam: 0,
    enabled: query.trim().length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch a single domain by name
 */
export function useName(name: string) {
  return useQuery({
    queryKey: domaQueryKeys.name(name),
    queryFn: () => domaService.getName(name),
    enabled: name.trim().length > 0 && name.includes("."),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000, // 30 minutes for individual domains
  });
}

/**
 * Hook to fetch domain statistics
 */
export function useNameStatistics(tokenId: string) {
  return useQuery({
    queryKey: domaQueryKeys.nameStats(tokenId),
    queryFn: () => domaService.getNameStatistics(tokenId),
    enabled: tokenId.trim().length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes for stats
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch marketplace listings with infinite scroll
 */
export function useListings(params: ListingsQueryParams = {}) {
  return useInfiniteQuery({
    queryKey: domaQueryKeys.listingsList(params),
    queryFn: ({ pageParam = 0 }) =>
      domaService.getListings({
        ...params,
        skip: pageParam,
        take: params.take || 20,
      }),
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage
        ? lastPage.currentPage * lastPage.pageSize
        : undefined;
    },
    initialPageParam: 0,
    staleTime: 2 * 60 * 1000, // 2 minutes for listings
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch offers with infinite scroll
 */
export function useOffers(params: OffersQueryParams = {}) {
  return useInfiniteQuery({
    queryKey: domaQueryKeys.offersList(params),
    queryFn: ({ pageParam = 0 }) =>
      domaService.getOffers({
        ...params,
        skip: pageParam,
        take: params.take || 20,
      }),
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage
        ? lastPage.currentPage * lastPage.pageSize
        : undefined;
    },
    initialPageParam: 0,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch domains by category
 */
export function useDomainsByCategory(category: string, params: Omit<NamesQueryParams, "tlds"> = {}) {
  return useInfiniteQuery({
    queryKey: domaQueryKeys.namesList({ ...params, tlds: [category] }),
    queryFn: ({ pageParam = 0 }) =>
      domaService.getDomainsByCategory(category, {
        ...params,
        skip: pageParam,
        take: params.take || 20,
      }),
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage
        ? lastPage.currentPage * lastPage.pageSize
        : undefined;
    },
    initialPageParam: 0,
    enabled: category.trim().length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch trending domains
 */
export function useTrendingDomains(limit: number = 10) {
  return useQuery({
    queryKey: [...domaQueryKeys.names(), "trending", limit],
    queryFn: () => domaService.getTrendingDomains(limit),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

/**
 * Hook to fetch recently listed domains
 */
export function useRecentlyListedDomains(limit: number = 20) {
  return useQuery({
    queryKey: [...domaQueryKeys.names(), "recent", limit],
    queryFn: () => domaService.getRecentlyListedDomains(limit),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch domains owned by a specific address
 */
export function useOwnedDomains(address: string, params: Omit<NamesQueryParams, "ownedBy"> = {}) {
  return useInfiniteQuery({
    queryKey: [...domaQueryKeys.names(), "owned", address, params],
    queryFn: ({ pageParam = 0 }) =>
      domaService.getOwnedDomains(address, {
        ...params,
        skip: pageParam,
        take: params.take || 20,
      }),
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage
        ? lastPage.currentPage * lastPage.pageSize
        : undefined;
    },
    initialPageParam: 0,
    enabled: address.trim().length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

/**
 * Hook to fetch name activities
 */
export function useNameActivities(params: NameActivitiesQueryParams) {
  return useInfiniteQuery({
    queryKey: domaQueryKeys.nameActivities(params),
    queryFn: ({ pageParam = 0 }) =>
      domaService.getNameActivities({
        ...params,
        skip: pageParam,
        take: params.take || 20,
      }),
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage
        ? lastPage.currentPage * lastPage.pageSize
        : undefined;
    },
    initialPageParam: 0,
    enabled: params.name.trim().length > 0,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch token activities
 */
export function useTokenActivities(params: TokenActivitiesQueryParams) {
  return useInfiniteQuery({
    queryKey: domaQueryKeys.tokenActivities(params),
    queryFn: ({ pageParam = 0 }) =>
      domaService.getTokenActivities({
        ...params,
        skip: pageParam,
        take: params.take || 20,
      }),
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage
        ? lastPage.currentPage * lastPage.pageSize
        : undefined;
    },
    initialPageParam: 0,
    enabled: params.tokenId.trim().length > 0,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}