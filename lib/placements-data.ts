export type PlacementCompany = {
  name: string;
  offers: number;
  onCampus: number;
  offCampus: number;
  /** Force this company into the "headliners" section even if it only has one offer. */
  featured?: boolean;
  /** Optional sub-label (e.g. "anonymous, by request"). */
  note?: string;
  /** Domain used to source a decorative favicon. Omit for anonymous categories. */
  domain?: string;
};

export const PLACEMENT_BATCH = {
  year: "2026",
  totalOffers: 32,
  onCampusOffers: 10,
  offCampusOffers: 22,
  companies: 26,
} as const;

export const PLACEMENT_COMPANIES: PlacementCompany[] = [
  { name: "FinalRoundAI", offers: 3, onCampus: 0, offCampus: 3, domain: "finalroundai.com" },
  { name: "Aspora", offers: 2, onCampus: 0, offCampus: 2, domain: "aspora.com" },
  { name: "Nasdaq", offers: 2, onCampus: 2, offCampus: 0, domain: "nasdaq.com" },
  { name: "Sabi", offers: 2, onCampus: 0, offCampus: 2, domain: "sabi.am" },
  { name: "Stealth Startups", offers: 2, onCampus: 0, offCampus: 2, note: "×2, anonymous" },
  { name: "Microsoft", offers: 1, onCampus: 1, offCampus: 0, featured: true, domain: "microsoft.com" },
  { name: "Oracle", offers: 1, onCampus: 0, offCampus: 1, featured: true, domain: "oracle.com" },
  { name: "VISA", offers: 1, onCampus: 1, offCampus: 0, featured: true, domain: "visa.com" },
  { name: "CRED", offers: 1, onCampus: 0, offCampus: 1, featured: true, domain: "cred.club" },
  { name: "Atlan", offers: 1, onCampus: 0, offCampus: 1, featured: true, domain: "atlan.com" },
  { name: "Breathe ESG", offers: 1, onCampus: 0, offCampus: 1, domain: "breatheesg.com" },
  { name: "Checkpoint Software", offers: 1, onCampus: 1, offCampus: 0, domain: "checkpoint.com" },
  { name: "Consilio", offers: 1, onCampus: 1, offCampus: 0, domain: "consilio.com" },
  { name: "Daita", offers: 1, onCampus: 0, offCampus: 1 },
  { name: "Edgeverve", offers: 1, onCampus: 1, offCampus: 0, domain: "edgeverve.com" },
  { name: "Es Magico", offers: 1, onCampus: 0, offCampus: 1, domain: "esmagico.in" },
  { name: "Eurofins", offers: 1, onCampus: 0, offCampus: 1, domain: "eurofins.com" },
  { name: "Maximus India", offers: 1, onCampus: 1, offCampus: 0, domain: "maximusindia.in" },
  { name: "New Relic", offers: 1, onCampus: 1, offCampus: 0, domain: "newrelic.com" },
  { name: "Open Climate Fix", offers: 1, onCampus: 0, offCampus: 1, domain: "openclimatefix.org" },
  { name: "OpenFX", offers: 1, onCampus: 0, offCampus: 1, domain: "openfx.com" },
  { name: "Remotestar", offers: 1, onCampus: 0, offCampus: 1, domain: "remotestar.io" },
  { name: "Sigmoid Analytics", offers: 1, onCampus: 0, offCampus: 1, domain: "sigmoid.com" },
  { name: "Zapcom", offers: 1, onCampus: 1, offCampus: 0, domain: "zapcg.com" },
  { name: "Zenskar", offers: 1, onCampus: 0, offCampus: 1, domain: "zenskar.com" },
  { name: "Zenact", offers: 1, onCampus: 0, offCampus: 1, domain: "zenact.ai" },
];

const tierWeight = (c: PlacementCompany) =>
  c.offers > 1 ? 100 + c.offers : c.featured ? 50 : 0;

export const HEADLINER_COMPANIES = PLACEMENT_COMPANIES
  .filter((c) => c.offers > 1 || c.featured)
  .sort((a, b) => tierWeight(b) - tierWeight(a) || a.name.localeCompare(b.name));

export const OTHER_COMPANIES = PLACEMENT_COMPANIES
  .filter((c) => c.offers <= 1 && !c.featured)
  .sort((a, b) => a.name.localeCompare(b.name));
