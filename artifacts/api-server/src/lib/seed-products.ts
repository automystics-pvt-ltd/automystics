import { db, productsTable } from "@workspace/db";
import { logger } from "./logger";

const DEFAULT_PRODUCTS: Array<typeof productsTable.$inferInsert> = [
  {
    key: "chit-fund",
    title: "Chit Fund Management",
    category: "Financial Technology",
    icon: "Building2",
    description:
      "A secure, transparent, and fully compliant digital platform designed specifically for finance companies to manage chit funds effortlessly.",
    features: [
      "Automated dividend calculation",
      "Member KYC & tracking",
      "Integrated payment gateways",
      "Regulatory compliance reporting",
    ],
    sortOrder: 10,
  },
  {
    key: "school-management",
    title: "School Management System",
    category: "EdTech",
    icon: "GraduationCap",
    description:
      "An end-to-end administration and academic management hub that connects educators, students, and parents in one seamless ecosystem.",
    features: [
      "Attendance & timetable management",
      "Fee collection & invoicing",
      "Examination & grading modules",
      "Parent-teacher communication portal",
    ],
    sortOrder: 20,
  },
  {
    key: "kalvicore",
    title: "KalviCore",
    category: "EdTech",
    icon: "GraduationCap",
    description:
      "Our flagship College Management System built for the complex workflows of modern higher education institutions.",
    features: [
      "University affiliation compliance",
      "Placement & alumni tracking",
      "Course & faculty management",
      "Hostel & transport administration",
    ],
    sortOrder: 30,
  },
  {
    key: "kural-ai",
    title: "Kural AI",
    category: "Artificial Intelligence",
    icon: "Mic",
    description:
      "Next-generation AI voice automation that transforms how businesses handle customer interactions, support, and internal operations.",
    features: [
      "Natural language understanding",
      "Multi-language voice synthesis",
      "Workflow trigger integration",
      "Sentiment analysis",
    ],
    sortOrder: 40,
  },
  {
    key: "auto-algo",
    title: "Auto Algo Trading",
    category: "Financial Technology",
    icon: "LineChart",
    description:
      "A high-frequency algorithmic trading platform that executes complex quantitative strategies with sub-millisecond latency.",
    features: [
      "Custom strategy builder",
      "Real-time market data ingestion",
      "Risk management controls",
      "Backtesting environment",
    ],
    sortOrder: 50,
  },
  {
    key: "scada",
    title: "SCADA Monitoring",
    category: "Industrial IoT",
    icon: "Sun",
    description:
      "Enterprise-grade SCADA systems optimized for large-scale solar power plants, providing complete operational visibility and control.",
    features: [
      "Real-time telemetry",
      "Predictive maintenance alerts",
      "Inverter performance tracking",
      "Historical data analytics",
    ],
    sortOrder: 60,
  },
  {
    key: "cctv",
    title: "CCTV AutoMonitoring AI",
    category: "Computer Vision",
    icon: "Camera",
    description:
      "Intelligent video analytics that transform passive surveillance cameras into active security and operational monitoring systems.",
    features: [
      "Intrusion detection",
      "Safety gear compliance",
      "Object tracking",
      "Automated incident alerts",
    ],
    sortOrder: 70,
  },
  {
    key: "fitro360",
    title: "Fitro360 — Gym Management System",
    category: "Health & Fitness",
    icon: "Dumbbell",
    description:
      "An all-in-one operating system for modern gyms, fitness studios, and wellness chains. Fitro360 unifies member onboarding, biometric attendance, billing, trainer scheduling, diet & workout plans, and franchise analytics in a single fast platform.",
    features: [
      "Member CRM & onboarding",
      "Biometric & RFID attendance",
      "Automated billing & dunning",
      "Trainer scheduling & PT plans",
      "Diet, workout & progress tracking",
      "Multi-branch franchise analytics",
    ],
    sortOrder: 80,
  },
  {
    key: "custom",
    title: "Custom Software Development",
    category: "Enterprise Solutions",
    icon: "Code",
    description:
      "Bespoke software architecture and development for complex business requirements, delivered with our signature high-speed methodology.",
    features: [
      "Cloud-native architecture",
      "Legacy system modernization",
      "API design & integration",
      "Scalable microservices",
    ],
    sortOrder: 90,
  },
];

export async function ensureDefaultProducts(): Promise<void> {
  try {
    const existing = await db.select({ id: productsTable.id }).from(productsTable).limit(1);
    if (existing.length > 0) {
      logger.info("products table already populated, skipping seed");
      return;
    }
    await db.insert(productsTable).values(DEFAULT_PRODUCTS);
    logger.info({ count: DEFAULT_PRODUCTS.length }, "default products seeded");
  } catch (err) {
    logger.error({ err }, "failed to seed default products");
  }
}
