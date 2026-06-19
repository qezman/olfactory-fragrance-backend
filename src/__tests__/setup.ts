import { vi } from "vitest";

const fragrances = [
  {
    id: "fx-cedar-08",
    slug: "cedar-08",
    name: "Cedar 08",
    family: ["woody"],
    sizes: [
      { ml: 50, price: 135 },
      { ml: 100, price: 220 },
    ],
  },
];

const customDiscoverySetFragrance = {
  id: "fx-custom-set",
  slug: "custom-set",
  name: "Custom Discovery Set",
  family: ["woody"],
  sizes: [{ ml: 10, price: 35 }],
};

class FakePrismaClient {
  fragrance = {
    findMany: vi.fn(async (args: any) => {
      if (args?.where?.family?.has) {
        return fragrances.filter((f) =>
          f.family.includes(args.where.family.has),
        );
      }
      return fragrances;
    }),
    findUnique: vi.fn(async (args: any) => {
      const slug = args?.where?.slug;
      if (slug === "custom-set") return customDiscoverySetFragrance;
      return fragrances.find((f) => f.slug === slug) ?? null;
    }),
  };

  order = {
    create: vi.fn(async (args: any) => ({
      id: `OLF-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
      ...args.data,
      items: args.data.items.create ?? args.data.items,
    })),
  };
}

vi.mock("@prisma/client", () => ({
  default: { PrismaClient: FakePrismaClient },
  PrismaClient: FakePrismaClient,
}));

vi.mock("@prisma/adapter-pg", () => ({
  PrismaPg: vi.fn(),
}));

vi.mock("pg", () => ({
  Pool: vi.fn(),
}));
