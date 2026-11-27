export const SITE = {
  name: "EUDIPLO",
  url: "https://eudiplo.dev",
  title: "EUDIPLO · Self-hosted middleware for the EU Digital Identity Wallet",
  description:
    "Open-source middleware for the EU Digital Identity Wallet that runs on your own servers. Verify and issue credentials with one API call; personal data stays with you.",
  docs: "https://docs.eudiplo.dev",
  github: "https://github.com/EUDIPLO/eudiplo",
  discord: "https://discord.gg/5Q4bgBQABa",
};

export const NAV = [
  { href: "/#how", label: "How it works" },
  { href: "/use-cases/", label: "Use cases" },
  { href: "/self-hosting/", label: "Self-hosting" },
  { href: "/blog/", label: "Blog" },
  { href: "/about/", label: "About" },
  { href: "https://docs.eudiplo.dev/", label: "Docs" },
  { href: "https://github.com/EUDIPLO/eudiplo", label: "GitHub" },
];

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
export const formatDate = (date: Date) => dateFormat.format(date);
export const isoDate = (date: Date) => date.toISOString().slice(0, 10);

export const KIND = {
  verify: { label: "Verify", className: "" },
  issue: { label: "Issue", className: "issue" },
  test: { label: "Test", className: "test" },
} as const;
