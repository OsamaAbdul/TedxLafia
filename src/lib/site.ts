export const SITE = {
  name: "TEDxLafia",
  tagline: "Ideas Worth Spreading",
  city: "Lafia, Nasarawa State, Nigeria",
  email: "hello@tedxlafia.com",
  registerUrl: "https://example.com/register",
  social: {
    instagram: "https://instagram.com/tedxlafia",
    x: "https://x.com/tedxlafia",
    linkedin: "https://linkedin.com/company/tedxlafia",
    youtube: "https://youtube.com/@tedxlafia",
  },
} as const;

export const NAV = [
  { to: "/about", label: "About" },
  { to: "/events", label: "Events" },
  { to: "/speakers", label: "Speakers" },
  { to: "/partners", label: "Partners" },
  { to: "/join", label: "Join Us" },
  { to: "/contact", label: "Contact" },
] as const;
