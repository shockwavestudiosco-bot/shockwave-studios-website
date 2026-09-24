// Site-wide constants shared by the header, footer and CTAs. Business facts
// (pricing, results, client names) do not belong here, they live in the brain.

export const CALENDLY_URL = "https://calendly.com/shockwavestudios-co/30min";

export const SERVICE_LINKS = [
  { href: "/video-marketing", label: "Video Marketing", blurb: "Monthly videos, strategy and posting" },
  { href: "/video-production", label: "Video Production", blurb: "Planned videos and event coverage" },
];

export const NAV_LINKS = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const FOOTER_LINKS = [...SERVICE_LINKS, ...NAV_LINKS];
