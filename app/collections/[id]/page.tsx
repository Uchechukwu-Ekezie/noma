import { CollectionDetailPage } from "@/components/marketplace/collection-detail-page";
import { notFound } from "next/navigation";

// Mock data - in a real app, this would come from an API
const mockCollections = [
  {
    id: "1",
    name: "Tech Startups Collection",
    description: "Premium domains for technology startups and innovative companies",
    image: "/uche.svg",
    domains: [
      { id: 1, name: "techstartup.com", price: "2.5 ETH", usdPrice: "6250", owner: "0x123...abc" },
      { id: 2, name: "innovate.io", price: "3.2 ETH", usdPrice: "8000", owner: "0xdef...456" },
      { id: 3, name: "startup.app", price: "1.8 ETH", usdPrice: "4500", owner: "0x789...ghi" },
      { id: 4, name: "techhub.com", price: "4.1 ETH", usdPrice: "10250", owner: "0xjkl...mno" },
      { id: 5, name: "innovation.xyz", price: "2.9 ETH", usdPrice: "7250", owner: "0xpqr...stu" },
      { id: 6, name: "techcorp.io", price: "3.7 ETH", usdPrice: "9250", owner: "0xvwx...yz0" },
    ],
    totalDomains: 25,
    floorPrice: "1.8 ETH",
    volume: "45.2 ETH",
    owner: "0x1234567890abcdef1234567890abcdef12345678",
    isVerified: true,
    followers: 1250,
    views: 15420,
  },
  {
    id: "2",
    name: "Crypto & DeFi",
    description: "Blockchain and decentralized finance domain names",
    image: "/uche.svg",
    domains: [
      { id: 7, name: "cryptoai.com", price: "1.8 ETH", usdPrice: "4500", owner: "0x111...222" },
      { id: 8, name: "defiprotocol.com", price: "5.5 ETH", usdPrice: "13750", owner: "0x333...444" },
      { id: 9, name: "blockchainapp.com", price: "4.1 ETH", usdPrice: "10250", owner: "0x555...666" },
      { id: 10, name: "cryptobank.io", price: "6.2 ETH", usdPrice: "15500", owner: "0x777...888" },
      { id: 11, name: "defiswap.com", price: "3.8 ETH", usdPrice: "9500", owner: "0x999...aaa" },
      { id: 12, name: "blockchain.tech", price: "7.1 ETH", usdPrice: "17750", owner: "0xbbb...ccc" },
    ],
    totalDomains: 18,
    floorPrice: "1.8 ETH",
    volume: "67.8 ETH",
    owner: "0xabcdef1234567890abcdef1234567890abcdef12",
    isVerified: true,
    followers: 890,
    views: 12300,
  },
  {
    id: "3",
    name: "NFT & Web3",
    description: "Non-fungible tokens and Web3 ecosystem domains",
    image: "/uche.svg",
    domains: [
      { id: 13, name: "nftmarket.com", price: "2.9 ETH", usdPrice: "7250", owner: "0xddd...eee" },
      { id: 14, name: "web3dev.com", price: "3.2 ETH", usdPrice: "8000", owner: "0xfff...000" },
      { id: 15, name: "metaverse.app", price: "4.5 ETH", usdPrice: "11250", owner: "0x111...222" },
      { id: 16, name: "nftgallery.io", price: "2.7 ETH", usdPrice: "6750", owner: "0x333...444" },
      { id: 17, name: "web3social.com", price: "3.9 ETH", usdPrice: "9750", owner: "0x555...666" },
      { id: 18, name: "metaverse.world", price: "5.2 ETH", usdPrice: "13000", owner: "0x777...888" },
    ],
    totalDomains: 32,
    floorPrice: "2.1 ETH",
    volume: "89.3 ETH",
    owner: "0x9876543210fedcba9876543210fedcba98765432",
    isVerified: false,
    followers: 2100,
    views: 18750,
  },
  {
    id: "4",
    name: "E-commerce Hub",
    description: "Premium domains for online retail and e-commerce businesses",
    image: "/uche.svg",
    domains: [
      { id: 19, name: "shoponline.com", price: "3.7 ETH", usdPrice: "9250", owner: "0x999...aaa" },
      { id: 20, name: "retail.store", price: "2.8 ETH", usdPrice: "7000", owner: "0xbbb...ccc" },
      { id: 21, name: "marketplace.io", price: "4.2 ETH", usdPrice: "10500", owner: "0xddd...eee" },
      { id: 22, name: "onlineshop.app", price: "3.1 ETH", usdPrice: "7750", owner: "0xfff...000" },
      { id: 23, name: "ecommerce.tech", price: "4.8 ETH", usdPrice: "12000", owner: "0x111...222" },
      { id: 24, name: "shopping.hub", price: "2.5 ETH", usdPrice: "6250", owner: "0x333...444" },
    ],
    totalDomains: 15,
    floorPrice: "2.8 ETH",
    volume: "34.6 ETH",
    owner: "0xfedcba9876543210fedcba9876543210fedcba98",
    isVerified: true,
    followers: 650,
    views: 8900,
  },
  {
    id: "5",
    name: "AI & Machine Learning",
    description: "Artificial intelligence and machine learning domain names",
    image: "/uche.svg",
    domains: [
      { id: 25, name: "aiplatform.com", price: "5.2 ETH", usdPrice: "13000", owner: "0x555...666" },
      { id: 26, name: "machinelearn.io", price: "3.9 ETH", usdPrice: "9750", owner: "0x777...888" },
      { id: 27, name: "deeplearning.app", price: "4.8 ETH", usdPrice: "12000", owner: "0x999...aaa" },
      { id: 28, name: "aifuture.com", price: "6.1 ETH", usdPrice: "15250", owner: "0xbbb...ccc" },
      { id: 29, name: "neuralnet.tech", price: "4.3 ETH", usdPrice: "10750", owner: "0xddd...eee" },
      { id: 30, name: "smartai.io", price: "5.7 ETH", usdPrice: "14250", owner: "0xfff...000" },
    ],
    totalDomains: 22,
    floorPrice: "3.5 ETH",
    volume: "78.4 ETH",
    owner: "0x13579bdf02468ace13579bdf02468ace13579bdf",
    isVerified: true,
    followers: 1800,
    views: 22100,
  },
  {
    id: "6",
    name: "Finance & Banking",
    description: "Financial services and banking domain names",
    image: "/uche.svg",
    domains: [
      { id: 31, name: "fintech.app", price: "6.1 ETH", usdPrice: "15250", owner: "0x111...222" },
      { id: 32, name: "banking.io", price: "7.5 ETH", usdPrice: "18750", owner: "0x333...444" },
      { id: 33, name: "invest.pro", price: "4.3 ETH", usdPrice: "10750", owner: "0x555...666" },
      { id: 34, name: "financehub.com", price: "5.8 ETH", usdPrice: "14500", owner: "0x777...888" },
      { id: 35, name: "banking.tech", price: "8.2 ETH", usdPrice: "20500", owner: "0x999...aaa" },
      { id: 36, name: "investment.io", price: "6.7 ETH", usdPrice: "16750", owner: "0xbbb...ccc" },
    ],
    totalDomains: 12,
    floorPrice: "4.3 ETH",
    volume: "92.7 ETH",
    owner: "0x2468ace13579bdf02468ace13579bdf02468ace",
    isVerified: true,
    followers: 950,
    views: 15600,
  },
];

interface CollectionPageProps {
  params: {
    id: string;
  };
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const collection = mockCollections.find(c => c.id === params.id);
  
  if (!collection) {
    notFound();
  }

  return <CollectionDetailPage collection={collection} />;
}

// Disable static generation to prevent serialization issues with interactive components
export const dynamic = 'force-dynamic'
