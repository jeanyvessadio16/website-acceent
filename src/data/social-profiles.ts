/**
 * Profils sociaux officiels ACCEENT — source unique pour le footer et le SEO.
 * Aperçus de liens : Facebook, Instagram, WhatsApp et TikTok utilisent Open Graph.
 * X utilise les balises `twitter:*` (toujours lues par la plateforme X).
 */

export const X_HANDLE = process.env.NEXT_PUBLIC_X_HANDLE ?? "campus_acceent";

export const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;

export const SOCIAL_PROFILES = {
  facebook: {
    id: "facebook",
    name: "Facebook",
    url: "https://www.facebook.com/share/1CZXwrYGEB/",
    icon: "/logo/media-social/facebook.svg",
  },
  instagram: {
    id: "instagram",
    name: "Instagram",
    url: "https://www.instagram.com/campus_acceent",
    handle: "campus_acceent",
    icon: "/logo/media-social/instagram.svg",
  },
  tiktok: {
    id: "tiktok",
    name: "TikTok",
    url: "https://www.tiktok.com/@campusacceent",
    handle: "campusacceent",
    icon: "/logo/media-social/tik-tok.svg",
  },
  whatsapp: {
    id: "whatsapp",
    name: "WhatsApp",
    url: "",
    phone: "+221761417070",
    icon: "/logo/media-social/whatsapp.svg",
  },
} as const;

/** URLs pour schema.org `sameAs` et cohérence SEO */
export const SOCIAL_SAME_AS = Object.values(SOCIAL_PROFILES).map(
  (profile) => profile.url,
);
