import { SOCIAL_PROFILES } from "@/data/social-profiles";

export const mediaLinks = [
  SOCIAL_PROFILES.facebook,
  SOCIAL_PROFILES.instagram,
  SOCIAL_PROFILES.tiktok,
  SOCIAL_PROFILES.x,
  SOCIAL_PROFILES.whatsapp,
].map((profile) => ({
  name: profile.name,
  href: profile.url,
  icon: profile.icon,
}));
