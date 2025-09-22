/**
 * TypeScript types for Doma Subgraph API
 * Based on the official Doma API documentation
 */

export type AddressCAIP10 = string; // e.g., "eip155:1:0x123..."
export type OrderbookType = "DOMA" | "OPENSEA";
export type TokenType = "OWNERSHIP" | "SYNTHETIC";
export type SortOrderType = "DESC" | "ASC";
export type NamesQueryClaimStatus = "CLAIMED" | "UNCLAIMED" | "ALL";
export type OfferStatus = "ACTIVE" | "EXPIRED" | "All";

export interface ChainModel {
  name: string;
  networkId: string;
}

export interface CurrencyModel {
  name: string;
  symbol: string;
  decimals: number;
}

export interface RegistrarModel {
  name: string;
  ianaId: string;
  websiteUrl?: string;
  supportEmail?: string;
  publicKeys: string[];
}

export interface PaymentInfoModel {
  price: string; // BigInt as string
  tokenAddress: string;
  currencySymbol: string;
}

export interface NameServerModel {
  ldhName: string;
}

export interface DSKeyModel {
  keyTag: number;
  algorithm: number;
  digest: string;
  digestType: number;
}

export interface ListingModel {
  id: string;
  externalId: string;
  price: string; // BigInt as string
  offererAddress: AddressCAIP10;
  orderbook: OrderbookType;
  expiresAt: string; // DateTime
  createdAt: string; // DateTime
  updatedAt: string; // DateTime
  currency: CurrencyModel;
}

export interface OfferModel {
  id: string;
  externalId: string;
  price: string; // BigInt as string
  offererAddress: AddressCAIP10;
  orderbook: OrderbookType;
  expiresAt: string; // DateTime
  createdAt: string; // DateTime
  currency: CurrencyModel;
}

export interface NameListingModel extends ListingModel {
  name: string;
  nameExpiresAt: string; // DateTime
  tokenId: string;
  tokenAddress: string;
  registrar: RegistrarModel;
  chain: ChainModel;
}

export interface NameOfferModel extends OfferModel {
  name: string;
  nameExpiresAt: string; // DateTime
  tokenId: string;
  tokenAddress: string;
  registrar: RegistrarModel;
  chain: ChainModel;
}

// Activity Types
export type NameActivityType = "TOKENIZED" | "CLAIMED" | "RENEWED" | "DETOKENIZED";
export type TokenActivityType =
  | "MINTED"
  | "TRANSFERRED"
  | "LISTED"
  | "OFFER_RECEIVED"
  | "LISTING_CANCELLED"
  | "OFFER_CANCELLED"
  | "PURCHASED";

export interface BaseActivity {
  type: string;
  txHash?: string;
  createdAt: string; // DateTime
}

export interface NameClaimedActivity extends BaseActivity {
  type: "CLAIMED";
  sld: string;
  tld: string;
  claimedBy: string;
}

export interface NameRenewedActivity extends BaseActivity {
  type: "RENEWED";
  sld: string;
  tld: string;
  expiresAt: string; // DateTime
}

export interface NameTokenizedActivity extends BaseActivity {
  type: "TOKENIZED";
  sld: string;
  tld: string;
  networkId: string;
}

export interface NameDetokenizedActivity extends BaseActivity {
  type: "DETOKENIZED";
  sld: string;
  tld: string;
  networkId: string;
}

export interface TokenMintedActivity extends BaseActivity {
  type: "MINTED";
  networkId: string;
  finalized: boolean;
  tokenId: string;
}

export interface TokenTransferredActivity extends BaseActivity {
  type: "TRANSFERRED";
  networkId: string;
  finalized: boolean;
  tokenId: string;
  transferredTo: string;
  transferredFrom: string;
}

export interface TokenListedActivity extends BaseActivity {
  type: "LISTED";
  networkId: string;
  finalized: boolean;
  tokenId: string;
  orderId: string;
  startsAt?: string; // DateTime
  expiresAt: string; // DateTime
  seller: string;
  buyer?: string;
  orderbook: OrderbookType;
  payment: PaymentInfoModel;
}

export interface TokenOfferReceivedActivity extends BaseActivity {
  type: "OFFER_RECEIVED";
  networkId: string;
  finalized: boolean;
  tokenId: string;
  orderId: string;
  expiresAt: string; // DateTime
  buyer: string;
  seller: string;
  orderbook: OrderbookType;
  payment: PaymentInfoModel;
}

export interface TokenPurchasedActivity extends BaseActivity {
  type: "PURCHASED";
  networkId: string;
  finalized: boolean;
  tokenId: string;
  orderId: string;
  purchasedAt: string; // DateTime
  seller: string;
  buyer: string;
  orderbook: OrderbookType;
  payment: PaymentInfoModel;
}

export type NameActivity =
  | NameClaimedActivity
  | NameRenewedActivity
  | NameTokenizedActivity
  | NameDetokenizedActivity;

export type TokenActivity =
  | TokenMintedActivity
  | TokenTransferredActivity
  | TokenListedActivity
  | TokenOfferReceivedActivity
  | TokenPurchasedActivity;

export interface TokenModel {
  tokenId: string;
  networkId: string;
  ownerAddress: AddressCAIP10;
  type: TokenType;
  tokenAddress: string;
  explorerUrl: string;
  startsAt?: string; // DateTime
  expiresAt: string; // DateTime
  createdAt: string; // DateTime
  openseaCollectionSlug?: string;
  chain: ChainModel;
  listings: ListingModel[];
  activities?: TokenActivity[];
}

export interface NameModel {
  name: string;
  expiresAt: string; // DateTime
  tokenizedAt: string; // DateTime
  eoi: boolean;
  claimedBy?: AddressCAIP10;
  transferLock?: boolean;
  registrar: RegistrarModel;
  nameservers: NameServerModel[];
  dsKeys?: DSKeyModel[];
  tokens: TokenModel[];
  activities: NameActivity[];
}

export interface NameStatisticsModel {
  name: string;
  activeOffers: number;
  offersLast3Days: number;
  highestOffer?: OfferModel;
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export type PaginatedNamesResponse = PaginatedResponse<NameModel>;
export type PaginatedTokensResponse = PaginatedResponse<TokenModel>;
export type PaginatedNameListingsResponse = PaginatedResponse<NameListingModel>;
export type PaginatedNameOffersResponse = PaginatedResponse<NameOfferModel>;
export type PaginatedNameActivitiesResponse = PaginatedResponse<NameActivity>;
export type PaginatedTokenActivitiesResponse = PaginatedResponse<TokenActivity>;

// Query Parameters
export interface NamesQueryParams {
  skip?: number;
  take?: number;
  ownedBy?: AddressCAIP10[];
  claimStatus?: NamesQueryClaimStatus;
  name?: string;
  networkIds?: string[];
  registrarIanaIds?: number[];
  tlds?: string[];
  sortOrder?: SortOrderType;
}

export interface ListingsQueryParams {
  skip?: number;
  take?: number;
  tlds?: string[];
  createdSince?: string; // DateTime
  sld?: string;
  networkIds?: string[];
  registrarIanaIds?: number[];
}

export interface OffersQueryParams {
  tokenId?: string;
  offeredBy?: AddressCAIP10[];
  skip?: number;
  take?: number;
  status?: OfferStatus;
  sortOrder?: SortOrderType;
}

export interface NameActivitiesQueryParams {
  name: string;
  skip?: number;
  take?: number;
  type?: NameActivityType;
  sortOrder?: SortOrderType;
}

export interface TokenActivitiesQueryParams {
  tokenId: string;
  skip?: number;
  take?: number;
  type?: TokenActivityType;
  sortOrder?: SortOrderType;
}