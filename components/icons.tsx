import type { SVGProps } from "react";

export type IconName =
  | "dashboard"
  | "products"
  | "geo"
  | "customers"
  | "trend"
  | "chat"
  | "report"
  | "sparkles"
  | "search"
  | "bell"
  | "arrow"
  | "revenue"
  | "units"
  | "risk"
  | "returns";

const paths: Record<IconName, React.ReactNode> = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
    </>
  ),
  products: (
    <>
      <path d="M6 8.5 12 5l6 3.5v7L12 19l-6-3.5z" />
      <path d="m6 8.5 6 3.5 6-3.5M12 12v7" />
    </>
  ),
  geo: (
    <>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  customers: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20v-2a5.5 5.5 0 0 1 11 0v2M16 4.5a3 3 0 0 1 0 5.8M17 14a5 5 0 0 1 3.5 4.8V20" />
    </>
  ),
  trend: (
    <>
      <path d="M4 17 9 12l4 3 7-8" />
      <path d="M15 7h5v5" />
    </>
  ),
  chat: (
    <>
      <path d="M20 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4z" />
      <path d="M8 9h8M8 13h5" />
    </>
  ),
  report: (
    <>
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </>
  ),
  sparkles: (
    <>
      <path d="m12 3 1.1 3.1L16 7.5l-2.9 1.4L12 12l-1.1-3.1L8 7.5l2.9-1.4zM18.5 14l.7 2 1.8.8-1.8.9-.7 2-.7-2-1.8-.9 1.8-.8zM5.5 14l.8 2.2 2.2.8-2.2.8L5.5 20l-.8-2.2-2.2-.8 2.2-.8z" />
    </>
  ),
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
  arrow: <><path d="M5 12h14M14 7l5 5-5 5" /></>,
  revenue: <><path d="M12 2v20M17 6.5c-1-1-2.4-1.5-4-1.5-2.2 0-4 1.2-4 3s1.7 2.6 4 3c2.3.4 4 1.2 4 3s-1.8 3-4 3c-1.8 0-3.4-.6-4.5-1.8" /></>,
  units: <><path d="m4 8 8-4 8 4-8 4zM4 8v8l8 4 8-4V8M12 12v8" /></>,
  risk: <><path d="M12 3 2.5 20h19zM12 9v4M12 17h.01" /></>,
  returns: <><path d="M9 7H5v-4M5.5 6.5A8 8 0 1 1 4 14" /></>,
};

export function Icon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
