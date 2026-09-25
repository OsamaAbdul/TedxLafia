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

export type NavItem = 
  | { to: string; label: string; children?: never }
  | { label: string; to?: never; children: { to: string; label: string }[] };

export const NAV: NavItem[] = [
  { 
    label: "About",
    children: [
      { to: "/about", label: "About TEDxLafia" },
      { to: "/team", label: "Our Team" },
    ]
  },
  { to: "/events", label: "Events" },
  { to: "/speakers", label: "Speakers" },
  { to: "/partners", label: "Partners" },
  { to: "/contact", label: "Contact" },
];
