/**
 * Doma GraphQL Queries
 * Based on Doma Subgraph API documentation
 */

export const GET_NAMES = `
  query GetNames(
    $skip: Int
    $take: Int
    $ownedBy: [AddressCAIP10!]
    $claimStatus: NamesQueryClaimStatus = ALL
    $name: String
    $networkIds: [String!]
    $registrarIanaIds: [Int!]
    $tlds: [String!]
    $sortOrder: SortOrderType = DESC
  ) {
    names(
      skip: $skip
      take: $take
      ownedBy: $ownedBy
      claimStatus: $claimStatus
      name: $name
      networkIds: $networkIds
      registrarIanaIds: $registrarIanaIds
      tlds: $tlds
      sortOrder: $sortOrder
    ) {
      items {
        name
        expiresAt
        tokenizedAt
        eoi
        claimedBy
        transferLock
        registrar {
          name
          ianaId
          websiteUrl
          supportEmail
          publicKeys
        }
        tokens {
          tokenId
          networkId
          ownerAddress
          type
          tokenAddress
          explorerUrl
          startsAt
          expiresAt
          createdAt
          openseaCollectionSlug
          chain {
            name
            networkId
          }
          listings {
            id
            externalId
            price
            offererAddress
            orderbook
            expiresAt
            createdAt
            updatedAt
            currency {
              name
              symbol
              decimals
            }
          }
        }
        activities {
          ... on NameClaimedActivity {
            type
            txHash
            sld
            tld
            createdAt
            claimedBy
          }
          ... on NameTokenizedActivity {
            type
            txHash
            sld
            tld
            createdAt
            networkId
          }
        }
      }
      totalCount
      pageSize
      currentPage
      totalPages
      hasNextPage
      hasPreviousPage
    }
  }
`;

export const GET_NAME = `
  query GetName($name: String!) {
    name(name: $name) {
      name
      claimedBy
      eoi
      expiresAt
      isFractionalized
      tokenizedAt
      transferLock
      nameservers {
        ldhName
      }
      registrar {
        ianaId
        name
        websiteUrl
        supportEmail
        publicKeys
      }
      tokens {
        tokenId
        tokenAddress
        networkId
        explorerUrl
        ownerAddress
        openseaCollectionSlug
        chain {
          addressUrlTemplate
          name
          networkId
        }
        listings {
          id
          offererAddress
          orderbook
          externalId
          price
          currency {
            name
            symbol
            decimals
            usdExchangeRate
          }
          createdAt
          expiresAt
        }
        startsAt
        createdAt
        expiresAt
        orderbookDisabled
      }
      activities {
        ... on NameClaimedActivity {
          type
          txHash
          sld
          tld
          createdAt
          claimedBy
        }
        ... on NameRenewedActivity {
          type
          txHash
          sld
          tld
          createdAt
          expiresAt
        }
        ... on NameDetokenizedActivity {
          type
          txHash
          sld
          tld
          createdAt
          networkId
        }
        ... on NameTokenizedActivity {
          type
          txHash
          sld
          tld
          createdAt
          networkId
        }
        ... on NameClaimRequestedActivity {
          type
          txHash
          sld
          tld
          createdAt
        }
        ... on NameClaimApprovedActivity {
          type
          txHash
          sld
          tld
          createdAt
        }
        ... on NameClaimRejectedActivity {
          type
          txHash
          sld
          tld
          createdAt
        }
      }
    }
  }
`;

export const GET_LISTINGS = `
  query GetListings(
    $skip: Int
    $take: Int
    $tlds: [String!]
    $createdSince: DateTime
    $sld: String
    $networkIds: [String!]
    $registrarIanaIds: [Int!]
  ) {
    listings(
      skip: $skip
      take: $take
      tlds: $tlds
      createdSince: $createdSince
      sld: $sld
      networkIds: $networkIds
      registrarIanaIds: $registrarIanaIds
    ) {
      items {
        id
        externalId
        price
        offererAddress
        orderbook
        expiresAt
        createdAt
        updatedAt
        name
        nameExpiresAt
        tokenId
        tokenAddress
        currency {
          name
          symbol
          decimals
        }
        registrar {
          name
          ianaId
          websiteUrl
          supportEmail
        }
        chain {
          name
          networkId
        }
      }
      totalCount
      pageSize
      currentPage
      totalPages
      hasNextPage
      hasPreviousPage
    }
  }
`;

export const GET_OFFERS = `
  query GetOffers(
    $tokenId: String
    $offeredBy: [AddressCAIP10!]
    $skip: Int
    $take: Int
    $status: OfferStatus
    $sortOrder: SortOrderType = DESC
  ) {
    offers(
      tokenId: $tokenId
      offeredBy: $offeredBy
      skip: $skip
      take: $take
      status: $status
      sortOrder: $sortOrder
    ) {
      items {
        id
        externalId
        price
        offererAddress
        orderbook
        expiresAt
        createdAt
        name
        nameExpiresAt
        tokenId
        tokenAddress
        currency {
          name
          symbol
          decimals
        }
        registrar {
          name
          ianaId
          websiteUrl
          supportEmail
        }
        chain {
          name
          networkId
        }
      }
      totalCount
      pageSize
      currentPage
      totalPages
      hasNextPage
      hasPreviousPage
    }
  }
`;

export const GET_NAME_STATISTICS = `
  query GetNameStatistics($tokenId: String!) {
    nameStatistics(tokenId: $tokenId) {
      name
      activeOffers
      offersLast3Days
      highestOffer {
        id
        externalId
        price
        offererAddress
        orderbook
        expiresAt
        createdAt
        currency {
          name
          symbol
          decimals
        }
      }
    }
  }
`;

export const GET_NAME_ACTIVITIES = `
  query GetNameActivities(
    $name: String!
    $skip: Int
    $take: Int
    $type: NameActivityType
    $sortOrder: SortOrderType = DESC
  ) {
    nameActivities(
      name: $name
      skip: $skip
      take: $take
      type: $type
      sortOrder: $sortOrder
    ) {
      items {
        ... on NameClaimedActivity {
          type
          txHash
          sld
          tld
          createdAt
          claimedBy
        }
        ... on NameRenewedActivity {
          type
          txHash
          sld
          tld
          createdAt
          expiresAt
        }
        ... on NameTokenizedActivity {
          type
          txHash
          sld
          tld
          createdAt
          networkId
        }
        ... on NameDetokenizedActivity {
          type
          txHash
          sld
          tld
          createdAt
          networkId
        }
      }
      totalCount
      pageSize
      currentPage
      totalPages
      hasNextPage
      hasPreviousPage
    }
  }
`;

export const GET_TOKEN_ACTIVITIES = `
  query GetTokenActivities(
    $tokenId: String!
    $skip: Int
    $take: Int
    $type: TokenActivityType
    $sortOrder: SortOrderType = DESC
  ) {
    tokenActivities(
      tokenId: $tokenId
      skip: $skip
      take: $take
      type: $type
      sortOrder: $sortOrder
    ) {
      items {
        ... on TokenMintedActivity {
          type
          networkId
          txHash
          finalized
          tokenId
          createdAt
        }
        ... on TokenTransferredActivity {
          type
          networkId
          txHash
          finalized
          tokenId
          createdAt
          transferredTo
          transferredFrom
        }
        ... on TokenListedActivity {
          type
          networkId
          txHash
          finalized
          tokenId
          createdAt
          orderId
          startsAt
          expiresAt
          seller
          buyer
          orderbook
          payment {
            price
            tokenAddress
            currencySymbol
          }
        }
        ... on TokenOfferReceivedActivity {
          type
          networkId
          txHash
          finalized
          tokenId
          createdAt
          orderId
          expiresAt
          buyer
          seller
          orderbook
          payment {
            price
            tokenAddress
            currencySymbol
          }
        }
        ... on TokenPurchasedActivity {
          type
          networkId
          txHash
          finalized
          tokenId
          createdAt
          orderId
          purchasedAt
          seller
          buyer
          orderbook
          payment {
            price
            tokenAddress
            currencySymbol
          }
        }
      }
      totalCount
      pageSize
      currentPage
      totalPages
      hasNextPage
      hasPreviousPage
    }
  }
`;

