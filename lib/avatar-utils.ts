/**
 * Avatar utilities for generating domain-related avatars using DiceBear API
 */

// DiceBear avatar styles that work well for domains
const AVATAR_STYLES = [
  'adventurer-neutral',
  'adventurer',
  'bottts-neutral',
  'identicon',
  'initials',
  'personas',
  'shapes',
] as const;

type AvatarStyle = typeof AVATAR_STYLES[number];

// Beautiful gradient colors that complement domain themes
const GRADIENT_COLORS = [
  ['#667eea', '#764ba2'], // Purple-Blue
  ['#f093fb', '#f5576c'], // Pink-Red
  ['#4facfe', '#00f2fe'], // Blue-Cyan
  ['#43e97b', '#38f9d7'], // Green-Turquoise
  ['#fa709a', '#fee140'], // Pink-Yellow
  ['#a8edea', '#fed6e3'], // Mint-Pink
  ['#ffecd2', '#fcb69f'], // Peach-Orange
  ['#ff8a80', '#ea4c89'], // Coral-Pink
  ['#667eea', '#764ba2'], // Blue-Purple
  ['#f6d365', '#fda085'], // Yellow-Orange
  ['#96fbc4', '#f9f047'], // Green-Yellow
  ['#fbc2eb', '#a6c1ee'], // Pink-Blue
] as const;

/**
 * Get avatar style based on domain name characteristics
 */
function getAvatarStyle(domainName: string): AvatarStyle {
  const name = domainName.toLowerCase();

  // Tech/AI domains get modern styles
  if (name.includes('ai') || name.includes('tech') || name.includes('bot') || name.includes('dev')) {
    return 'bottts-neutral';
  }

  // Gaming/fun domains get adventurer style
  if (name.includes('game') || name.includes('play') || name.includes('fun') || name.includes('adventure')) {
    return 'adventurer';
  }

  // Business/professional domains get personas
  if (name.includes('corp') || name.includes('biz') || name.includes('pro') || name.includes('company')) {
    return 'personas';
  }

  // Crypto/web3 domains get identicon (blocky/crypto feel)
  if (name.includes('crypto') || name.includes('web3') || name.includes('nft') || name.includes('defi')) {
    return 'identicon';
  }

  // Abstract/artistic domains get shapes
  if (name.includes('art') || name.includes('design') || name.includes('studio') || name.includes('creative')) {
    return 'shapes';
  }

  // Default to adventurer-neutral (clean, professional)
  return 'adventurer-neutral';
}

/**
 * Generate a hash from string for consistent randomization
 */
function stringToHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Get gradient colors based on domain name
 */
export function getDomainGradient(domainName: string): [string, string] {
  const hash = stringToHash(domainName);
  const index = hash % GRADIENT_COLORS.length;
  return GRADIENT_COLORS[index];
}

/**
 * Generate avatar URL for messaging/conversations using Lorelei style
 */
export function getConversationAvatarUrl(
  seed: string,
  options: {
    size?: number;
    backgroundColor?: string[];
    backgroundType?: 'gradientLinear' | 'solid';
  } = {}
): string {
  const {
    size = 48,
    backgroundColor,
    backgroundType = 'gradientLinear'
  } = options;

  // Use seed (wallet address or conversation ID) for consistency
  const cleanSeed = encodeURIComponent(seed);

  // Build query parameters for Lorelei
  const params = new URLSearchParams({
    seed: cleanSeed,
    size: size.toString(),
    backgroundType,
  });

  // Add background colors if provided, otherwise use seed-based gradient
  if (backgroundColor && backgroundColor.length > 0) {
    params.append('backgroundColor', backgroundColor.join(','));
  } else {
    const [color1, color2] = getDomainGradient(seed);
    // Remove # from hex colors
    const cleanColor1 = color1.replace('#', '');
    const cleanColor2 = color2.replace('#', '');
    params.append('backgroundColor', `${cleanColor1},${cleanColor2}`);
  }

  return `https://api.dicebear.com/9.x/lorelei/svg?${params.toString()}`;
}

/**
 * Generate avatar URL for a domain
 */
export function getDomainAvatarUrl(
  domainName: string,
  options: {
    size?: number;
    style?: AvatarStyle;
    backgroundColor?: string[];
    backgroundType?: 'gradientLinear' | 'solid';
  } = {}
): string {
  const {
    size = 80,
    style = getAvatarStyle(domainName),
    backgroundColor,
    backgroundType = 'gradientLinear'
  } = options;

  // Use domain name as seed for consistency
  const seed = encodeURIComponent(domainName);

  // Build query parameters
  const params = new URLSearchParams({
    seed,
    size: size.toString(),
    backgroundType,
  });

  // Add background colors if provided, otherwise use domain gradient
  if (backgroundColor && backgroundColor.length > 0) {
    params.append('backgroundColor', backgroundColor.join(','));
  } else {
    const [color1, color2] = getDomainGradient(domainName);
    // Remove # from hex colors
    const cleanColor1 = color1.replace('#', '');
    const cleanColor2 = color2.replace('#', '');
    params.append('backgroundColor', `${cleanColor1},${cleanColor2}`);
  }

  return `https://api.dicebear.com/9.x/${style}/svg?${params.toString()}`;
}

/**
 * Generate CSS gradient string for domain
 */
export function getDomainGradientCSS(domainName: string, direction: string = 'to right'): string {
  const [color1, color2] = getDomainGradient(domainName);
  return `linear-gradient(${direction}, ${color1}, ${color2})`;
}

/**
 * Get dominant color from domain (first color of gradient)
 */
export function getDomainPrimaryColor(domainName: string): string {
  const [primaryColor] = getDomainGradient(domainName);
  return primaryColor;
}

/**
 * Generate avatar props for React components (domains)
 */
export function getDomainAvatarProps(domainName: string, size: number = 80) {
  return {
    src: getDomainAvatarUrl(domainName, { size }),
    alt: `${domainName} avatar`,
    style: {
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
    }
  };
}

/**
 * Generate avatar props for React components (conversations)
 */
export function getConversationAvatarProps(address: string, size: number = 48) {
  return {
    src: getConversationAvatarUrl(address, { size }),
    alt: `${address} avatar`,
    style: {
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
    }
  };
}

/**
 * Avatar component styles for different use cases
 */
export const avatarStyles = {
  // For domain cards
  card: (domainName: string) => ({
    background: getDomainGradientCSS(domainName),
    backgroundSize: 'cover',
    borderRadius: '12px',
  }),

  // For profile/chat avatars (using Lorelei style)
  profile: (address: string) => ({
    background: getDomainGradientCSS(address, '45deg'),
    borderRadius: '50%',
    border: `2px solid ${getDomainPrimaryColor(address)}33`,
  }),

  // For conversation list items
  conversation: (address: string) => ({
    background: getDomainGradientCSS(address, '135deg'),
    borderRadius: '50%',
    border: `1px solid ${getDomainPrimaryColor(address)}22`,
  }),

  // For collection headers
  collection: (domainName: string) => ({
    background: getDomainGradientCSS(domainName, 'to bottom right'),
    backgroundSize: '150% 150%',
    animation: 'gradientShift 8s ease infinite',
  }),
};