import { DomainDetailPage } from "@/components/marketplace/domain-detail-page";
import { notFound } from "next/navigation";

// Mock data - in a real app, this would come from an API
const mockDomains = [
  {
    id: "1",
    name: "monoplay01.ai",
    price: "0.35 ETH",
    usdPrice: "1569",
    owner: "0xC517cEe1ECb196fe94582D0208f9D3BEE2f563c2",
    isListed: true,
    category: "AI",
    description: "Premium AI domain for modern gaming and AI applications",
    features: ["AI TLD", "Blockchain Verified", "Active Listing"],
    history: [
      { event: "Listed for sale", date: "2025-09-21", price: "0.35 ETH" },
      { event: "Domain tokenized", date: "2025-09-21", price: "0.0 ETH" },
    ],
    similarDomains: [
      { name: "monoplay02.ai", price: "0.4 ETH", owner: "0xabc...def" },
      { name: "monoplay.ai", price: "0.8 ETH", owner: "0xdef...456" },
    ],
    // Real API data structure
    data: {
      name: {
        name: "monoplay01.ai",
        claimedBy: "eip155:97476:0xC517cEe1ECb196fe94582D0208f9D3BEE2f563c2",
        eoi: false,
        expiresAt: "2027-09-21T00:46:20.000Z",
        isFractionalized: false,
        tokenizedAt: "2025-09-21T00:46:28.117Z",
        transferLock: false,
        fractionalTokenInfo: [],
        nameservers: [],
        registrar: {
          ianaId: "3784",
          name: "D3 Registrar",
          websiteUrl: "https://testnet.d3.app",
          supportEmail: "support@d3.email",
          publicKeys: [
            "0x78b5ea9d12b9f259c1f91807ffc1adf2842ba347ff5ac438f80114e054edc9c27b62b828c2d303ee4ece14217981921d6b25c14edb2646f7b7176d90730cd973"
          ]
        },
        tokens: [
          {
            tokenId: "97551185629242771106410672894738017604479942199094100824343299409472984952586",
            tokenAddress: "0x424bDf2E8a6F52Bd2c1C81D9437b0DC0309DF90f",
            networkId: "eip155:97476",
            explorerUrl: "https://explorer-testnet.doma.xyz/token/0x424bDf2E8a6F52Bd2c1C81D9437b0DC0309DF90f?a=97551185629242771106410672894738017604479942199094100824343299409472984952586",
            ownerAddress: "eip155:97476:0xC517cEe1ECb196fe94582D0208f9D3BEE2f563c2",
            openseaCollectionSlug: null,
            chain: {
              addressUrlTemplate: "https://explorer-testnet.doma.xyz/address/:address",
              name: "Doma Testnet",
              networkId: "eip155:97476"
            },
            listings: [
              {
                id: "791722",
                offererAddress: "eip155:97476:0xC517cEe1ECb196fe94582D0208f9D3BEE2f563c2",
                orderbook: "DOMA",
                externalId: "0x2a1644a8e79a324158e6f64b5dd893bf32cd8880a70fdcb9d22b791e6c9033a6",
                price: "350000000000000000",
                currency: {
                  name: "Ethereum",
                  symbol: "ETH",
                  decimals: 18,
                  usdExchangeRate: 4485.369920563314
                },
                createdAt: "2025-09-21T00:46:52.015Z",
                expiresAt: "2025-12-21T00:46:52.000Z"
              }
            ],
            startsAt: null,
            createdAt: "2025-09-21T00:46:29.642Z",
            expiresAt: "2027-09-21T00:46:20.000Z",
            orderbookDisabled: false
          }
        ],
        activities: [
          {
            type: "TOKENIZED",
            txHash: "0xb0783f120845330a8cbc00246cb0a93215516e6946f7ebb07258e3e03caff64a",
            sld: "monoplay01",
            tld: "ai",
            createdAt: "2025-09-21T00:46:28.094Z",
            networkId: "eip155:97476"
          }
        ]
      }
    }
  },
  {
    id: "2",
    name: "web3.xyz",
    price: "0.8 ETH",
    usdPrice: "1600",
    owner: "0xabcdef1234567890abcdef1234567890abcdef12",
    isListed: true,
    category: "Web3",
    description: "Perfect domain for Web3 projects and decentralized applications",
    features: ["Web3 Focused", "Blockchain Verified", "Active Listing"],
    history: [
      { event: "Listed for sale", date: "2024-01-10", price: "0.8 ETH" },
      { event: "Domain registered", date: "2023-11-20", price: "0.05 ETH" },
    ],
    similarDomains: [
      { name: "web3.io", price: "1.2 ETH", owner: "0x123...abc" },
      { name: "web3.app", price: "1.5 ETH", owner: "0x456...def" },
    ],
  },
  {
    id: "3",
    name: "ai.tech",
    price: "2.5 ETH",
    usdPrice: "5000",
    owner: "0x9876543210fedcba9876543210fedcba98765432",
    isListed: true,
    category: "AI",
    description: "Premium AI and technology domain for cutting-edge applications",
    features: ["Premium TLD", "AI Focused", "Blockchain Verified"],
    history: [
      { event: "Listed for sale", date: "2024-01-20", price: "2.5 ETH" },
      { event: "Domain registered", date: "2023-10-15", price: "0.2 ETH" },
    ],
    similarDomains: [
      { name: "ai.io", price: "3.0 ETH", owner: "0x789...ghi" },
      { name: "ai.app", price: "2.8 ETH", owner: "0xjkl...mno" },
    ],
  },
  {
    id: "4",
    name: "crypto.io",
    price: "0.5 ETH",
    usdPrice: "1000",
    owner: "0xfedcba9876543210fedcba9876543210fedcba98",
    isListed: true,
    category: "Crypto",
    description: "Classic cryptocurrency domain for blockchain projects",
    features: ["Crypto Focused", "Blockchain Verified", "Active Listing"],
    history: [
      { event: "Listed for sale", date: "2024-01-05", price: "0.5 ETH" },
      { event: "Domain registered", date: "2023-09-30", price: "0.03 ETH" },
    ],
    similarDomains: [
      { name: "crypto.com", price: "5.0 ETH", owner: "0xpqr...stu" },
      { name: "crypto.xyz", price: "0.7 ETH", owner: "0xvwx...yz0" },
    ],
  },
  {
    id: "5",
    name: "metaverse.art",
    price: "3.0 ETH",
    usdPrice: "6000",
    owner: "0x13579bdf02468ace13579bdf02468ace13579bdf",
    isListed: true,
    category: "Metaverse",
    description: "Perfect domain for metaverse and digital art projects",
    features: ["Metaverse Focused", "Art TLD", "Blockchain Verified"],
    history: [
      { event: "Listed for sale", date: "2024-01-25", price: "3.0 ETH" },
      { event: "Domain registered", date: "2023-08-20", price: "0.15 ETH" },
    ],
    similarDomains: [
      { name: "metaverse.io", price: "4.2 ETH", owner: "0x111...222" },
      { name: "metaverse.app", price: "3.5 ETH", owner: "0x333...444" },
    ],
  },
  {
    id: "6",
    name: "blockchain.dev",
    price: "1.0 ETH",
    usdPrice: "2000",
    owner: "0x2468ace13579bdf02468ace13579bdf02468ace",
    isListed: true,
    category: "Blockchain",
    description: "Developer-focused blockchain domain for technical projects",
    features: ["Developer Focused", "Blockchain Verified", "Active Listing"],
    history: [
      { event: "Listed for sale", date: "2024-01-12", price: "1.0 ETH" },
      { event: "Domain registered", date: "2023-07-10", price: "0.08 ETH" },
    ],
    similarDomains: [
      { name: "blockchain.io", price: "2.1 ETH", owner: "0x555...666" },
      { name: "blockchain.tech", price: "1.8 ETH", owner: "0x777...888" },
    ],
  },
  {
    id: "7",
    name: "digital.space",
    price: "0.7 ETH",
    usdPrice: "1400",
    owner: "0x1111222233334444555566667777888899990000",
    isListed: true,
    category: "Digital",
    description: "Versatile digital domain for modern businesses",
    features: ["Digital Focused", "Blockchain Verified", "Active Listing"],
    history: [
      { event: "Listed for sale", date: "2024-01-08", price: "0.7 ETH" },
      { event: "Domain registered", date: "2023-06-15", price: "0.06 ETH" },
    ],
    similarDomains: [
      { name: "digital.io", price: "1.3 ETH", owner: "0x999...aaa" },
      { name: "digital.app", price: "1.1 ETH", owner: "0xbbb...ccc" },
    ],
  },
  {
    id: "8",
    name: "future.net",
    price: "1.5 ETH",
    usdPrice: "3000",
    owner: "0x3333444455556666777788889999000011112222",
    isListed: true,
    category: "Future",
    description: "Forward-thinking domain for innovative projects",
    features: ["Future Focused", "Blockchain Verified", "Active Listing"],
    history: [
      { event: "Listed for sale", date: "2024-01-18", price: "1.5 ETH" },
      { event: "Domain registered", date: "2023-05-20", price: "0.12 ETH" },
    ],
    similarDomains: [
      { name: "future.io", price: "2.0 ETH", owner: "0xddd...eee" },
      { name: "future.app", price: "1.8 ETH", owner: "0xfff...000" },
    ],
  },
  {
    id: "9",
    name: "innovate.co",
    price: "0.9 ETH",
    usdPrice: "1800",
    owner: "0x5555666677778888999900001111222233334444",
    isListed: true,
    category: "Innovation",
    description: "Innovation-focused domain for creative projects",
    features: ["Innovation Focused", "Blockchain Verified", "Active Listing"],
    history: [
      { event: "Listed for sale", date: "2024-01-14", price: "0.9 ETH" },
      { event: "Domain registered", date: "2023-04-25", price: "0.09 ETH" },
    ],
    similarDomains: [
      { name: "innovate.io", price: "1.4 ETH", owner: "0x111...222" },
      { name: "innovate.tech", price: "1.2 ETH", owner: "0x333...444" },
    ],
  },
  {
    id: "10",
    name: "domain.xyz",
    price: "1.1 ETH",
    usdPrice: "2200",
    owner: "0x7777888899990000111122223333444455556666",
    isListed: true,
    category: "Domain",
    description: "Meta domain perfect for domain-related services",
    features: ["Meta Domain", "Blockchain Verified", "Active Listing"],
    history: [
      { event: "Listed for sale", date: "2024-01-22", price: "1.1 ETH" },
      { event: "Domain registered", date: "2023-03-30", price: "0.11 ETH" },
    ],
    similarDomains: [
      { name: "domain.io", price: "1.6 ETH", owner: "0x555...666" },
      { name: "domain.app", price: "1.3 ETH", owner: "0x777...888" },
    ],
  },
];

interface DomainPageProps {
  params: {
    id: string;
  };
}

export default function DomainPage({ params }: DomainPageProps) {
  const domain = mockDomains.find(d => d.id === params.id);
  
  if (!domain) {
    notFound();
  }

  return <DomainDetailPage domain={domain} />;
}

// Disable static generation to prevent serialization issues with interactive components
export const dynamic = 'force-dynamic'
