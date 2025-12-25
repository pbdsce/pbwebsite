// /components/ui/shared.ts
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export interface NavItem {
  href: string;
  label: string;
  isExternal?: boolean;
  icon?: any;
  specialPadding?: boolean;
}

export const navItems: NavItem[] = [
  { href: "https://github.com/pbdsce", label: "GitHub", isExternal: true, icon: faGithub },
  { href: "https://careers.pointblank.club/", label: "Hire Us" },
  { href: "/events", label: "Events" },
  { href: "/leads", label: "Leads" },
  { href: "/lore", label: "Lore" },
  { href: "/members", label: "Members", specialPadding: true },
  { href: "/achievements", label: "Achievements" },
  { href: "/hustle", label: "Hustle Results" },
];

export const footerConfig = {
  madeWith: "Made with ❤️ by",
  orgName: "Point Blank",
  copyright: "All Rights Reserved.",
};
