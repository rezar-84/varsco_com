import type { Order, CustomsDocument } from "../types";

export const MOCK_ORDERS: Order[] = [
  {
    id: "Q-24081",
    date: "2026-06-14",
    products: ["Atlantic Salmon Egg × 100,000"],
    status: "Approved",
    total: "$14,200",
  },
  {
    id: "Q-24076",
    date: "2026-05-30",
    products: ["Brinova Artemia × 40 cans"],
    status: "Shipped",
    total: "$3,120",
  },
  { id: "Q-24070", date: "2026-05-11", products: ["Fish Meal × 25 MT"], status: "Pending Review" },
  {
    id: "Q-24065",
    date: "2026-04-22",
    products: ["Mediterranean Sea Bass × 500 kg"],
    status: "Cancelled",
  },
];

export const MOCK_DOCUMENTS: CustomsDocument[] = [
  {
    id: "D-1201",
    name: "Commercial Invoice — Q-24081",
    type: "Invoice",
    date: "2026-06-14",
    url: "#",
  },
  {
    id: "D-1202",
    name: "Health Certificate — Q-24081",
    type: "Certificate",
    date: "2026-06-14",
    url: "#",
  },
  {
    id: "D-1198",
    name: "Customs Declaration — Q-24076",
    type: "Customs",
    date: "2026-05-30",
    url: "#",
  },
  { id: "D-1180", name: "ASC Certificate 2026", type: "Certificate", date: "2026-01-02", url: "#" },
];
