export const HOME_CIRCLE_FOCUS_KEY = "home-circle-focus";

export interface AppCard {
  /** Brand icon image URL */
  icon: string;
  name: string;
  url: string;
  /** Card / circle background color */
  brandColor: string;
}

export const APP_CARDS: AppCard[] = [
  {
    icon: "https://cdn.simpleicons.org/youtube/FFFFFF",
    name: "YouTube",
    url: "https://www.youtube.com/",
    brandColor: "#FF0000",
  },
  {
    icon: "https://cdn.simpleicons.org/instagram/FFFFFF",
    name: "Instagram",
    url: "https://www.instagram.com/",
    brandColor: "#E4405F",
  },
  {
    icon: "https://cdn.simpleicons.org/linkedin/FFFFFF",
    name: "LinkedIn",
    url: "https://www.linkedin.com/",
    brandColor: "#0A66C2",
  },
  {
    icon: "https://cdn.simpleicons.org/facebook/FFFFFF",
    name: "Facebook",
    url: "https://www.facebook.com/",
    brandColor: "#1877F2",
  },
  {
    icon: "https://cdn.simpleicons.org/x/FFFFFF",
    name: "X",
    url: "https://x.com/",
    brandColor: "#000000",
  },
  {
    icon: "https://cdn.simpleicons.org/whatsapp/FFFFFF",
    name: "WhatsApp",
    url: "https://web.whatsapp.com/",
    brandColor: "#25D366",
  },
  {
    icon: "https://cdn.simpleicons.org/gmail/FFFFFF",
    name: "Gmail",
    url: "https://mail.google.com/",
    brandColor: "#EA4335",
  },
  {
    icon: "https://cdn.simpleicons.org/spotify/FFFFFF",
    name: "Spotify",
    url: "https://open.spotify.com/",
    brandColor: "#1DB954",
  },
  {
    icon: "https://cdn.simpleicons.org/netflix/FFFFFF",
    name: "Netflix",
    url: "https://www.netflix.com/",
    brandColor: "#E50914",
  },
  {
    icon: "https://cdn.simpleicons.org/amazon/FFFFFF",
    name: "Amazon",
    url: "https://www.amazon.in/",
    brandColor: "#FF9900",
  },
  {
    icon: "https://cdn.simpleicons.org/github/FFFFFF",
    name: "GitHub",
    url: "https://github.com/",
    brandColor: "#181717",
  },
  {
    icon: "https://cdn.simpleicons.org/tiktok/FFFFFF",
    name: "TikTok",
    url: "https://www.tiktok.com/",
    brandColor: "#000000",
  },
  {
    icon: "https://cdn.simpleicons.org/snapchat/000000",
    name: "Snapchat",
    url: "https://www.snapchat.com/",
    brandColor: "#FFFC00",
  },
  {
    icon: "https://cdn.simpleicons.org/pinterest/FFFFFF",
    name: "Pinterest",
    url: "https://www.pinterest.com/",
    brandColor: "#BD081C",
  },
  {
    icon: "https://cdn.simpleicons.org/reddit/FFFFFF",
    name: "Reddit",
    url: "https://www.reddit.com/",
    brandColor: "#FF4500",
  },
];

export const TOTAL_APP_COUNT = APP_CARDS.length;

/** @deprecated Use APP_CARDS */
export const HERO_IMAGES = APP_CARDS.map((card) => card.icon);

export function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 999.91) * 10000;
  return x - Math.floor(x);
}
