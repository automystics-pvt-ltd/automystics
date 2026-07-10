import React from "react";
import { SEO } from "@/components/seo";
import { motion } from "framer-motion";
import { ShieldCheck, Sparkles } from "lucide-react";

const sections: { title: string; body: string | string[] }[] = [
  {
    title: "1. Introduction",
    body: `Automystics Technologies Private Limited ("Automystics", "we", "our", or "us") is committed to protecting the privacy of our clients, prospects, employees, candidates, and website visitors. This Privacy Policy explains how we collect, use, disclose, store, and safeguard personal information when you interact with our website, products, and services.`,
  },
  {
    title: "2. Information We Collect",
    body: [
      "Identity & contact data: name, email, phone number, company, job title, country.",
      "Project data: details you submit through forms, demo requests, RFPs, or support tickets.",
      "Technical data: IP address, browser type, device identifiers, operating system, referrer URL, time-stamps.",
      "Usage data: pages visited, features used, click events, session duration, performance metrics.",
      "Cookies & similar technologies: session cookies, preference cookies, and analytics cookies (see Section 7).",
    ],
  },
  {
    title: "3. How We Use Your Information",
    body: [
      "To respond to enquiries, demo requests, and contract negotiations.",
      "To deliver, operate, secure, and improve our products and services.",
      "To send service announcements, security notifications, and (with consent) marketing communications.",
      "To comply with legal, regulatory, audit, and tax obligations.",
      "To detect, prevent, and investigate fraud, abuse, or breaches of our terms.",
    ],
  },
  {
    title: "4. Legal Basis for Processing",
    body: `We process personal data on the basis of your consent, the performance of a contract with you, our legitimate business interests (e.g. running and securing our services), and our legal obligations under applicable laws including the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023 (India), and where relevant, GDPR for EU/EEA data subjects.`,
  },
  {
    title: "5. Sharing & Disclosure",
    body: [
      "Service providers: cloud hosting (AWS, Google Cloud, Azure), email/CRM tools, analytics, and payment processors operating under strict confidentiality and data-processing agreements.",
      "Legal & regulatory: when required by law, court order, or to protect rights, property, and safety.",
      "Business transfers: in connection with a merger, acquisition, financing, or sale of assets, subject to confidentiality.",
      "We do not sell or rent personal information to third parties.",
    ],
  },
  {
    title: "6. International Transfers",
    body: `Your information may be processed in countries other than your own, including India, the United States, and the European Union. Where required, we use Standard Contractual Clauses or equivalent safeguards to ensure your data receives an adequate level of protection.`,
  },
  {
    title: "7. Cookies",
    body: `We use first-party and third-party cookies to enable core site functionality, remember preferences, and measure usage. You can disable cookies through your browser settings; however, some features of the site may not function properly without them.`,
  },
  {
    title: "8. Data Retention",
    body: `We retain personal data only for as long as necessary to fulfil the purposes described in this policy, satisfy contractual commitments, or comply with legal, accounting, or reporting obligations. When data is no longer required, it is securely deleted or anonymised.`,
  },
  {
    title: "9. Security",
    body: `We maintain administrative, technical, and physical safeguards aligned with ISO 27001 controls, including encryption in transit (TLS 1.2+), encryption at rest (AES-256), least-privilege access, MFA, audit logging, vulnerability management, and regular penetration testing.`,
  },
  {
    title: "10. Your Rights",
    body: [
      "Access — request a copy of personal data we hold about you.",
      "Correction — ask us to rectify inaccurate or incomplete data.",
      "Erasure — request deletion of your data, subject to legal retention requirements.",
      "Restriction & objection — limit or object to certain processing activities.",
      "Portability — receive your data in a structured, machine-readable format.",
      "Withdraw consent — withdraw previously given consent at any time.",
    ],
  },
  {
    title: "11. Children's Privacy",
    body: `Our services are intended for business users and are not directed to children under 18. We do not knowingly collect personal information from children.`,
  },
  {
    title: "12. Changes to This Policy",
    body: `We may update this Privacy Policy from time to time. Material changes will be notified through our website or email. The "Last updated" date below indicates when the latest revision was published.`,
  },
  {
    title: "13. Contact Us",
    body: `For privacy questions, requests, or complaints, contact our Data Protection Officer at privacy@automystics.com or write to: Automystics Technologies Private Limited, Coimbatore, Tamil Nadu, India.`,
  },
];

export function Privacy() {
  return (
    <div className="bg-transparent relative">
      <SEO
        title="Privacy Policy — Automystics Technologies Private Limited"
        description="Read the Privacy Policy of Automystics Technologies Private Limited — how we collect, use, store, and protect personal data across our AI automation products and services."
        keywords="Automystics privacy policy, data protection, GDPR, DPDP Act India, ISO 27001 privacy, Automystics Technologies privacy"
        canonical="/privacy"
      />

      <div className="absolute top-0 left-0 right-0 h-[520px] bg-[#0A0612] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[520px] bg-[radial-gradient(ellipse_80%_60%_at_0%_50%,_rgba(8,145,178,0.35),_transparent_60%)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[520px] bg-[radial-gradient(ellipse_80%_60%_at_100%_50%,_rgba(34,211,238,0.28),_transparent_60%)] pointer-events-none" />

      <div className="pt-36 pb-16 relative z-10 overflow-hidden">
        <div className="absolute inset-0 dark-grid-pattern opacity-30 pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center pt-6 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-lg shadow-primary/10 text-primary text-xs font-bold mb-8 uppercase tracking-[0.2em] mx-auto backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5" /> LEGAL <span className="w-1 h-1 rounded-full bg-primary" /> Last updated: April 17, 2026
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
              Privacy <span className="bg-gradient-to-r from-cyan-400 via-primary to-cyan-300 bg-clip-text text-transparent">Policy</span>
            </h1>
            <p className="text-base md:text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
              How Automystics Technologies Private Limited collects, uses, and protects your personal information.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="py-20 bg-background relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="space-y-10">
            {sections.map((s, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: idx * 0.03 }}
                className="bg-white border border-card-border rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 transition-all"
              >
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-primary" />
                  {s.title}
                </h2>
                {Array.isArray(s.body) ? (
                  <ul className="space-y-2 text-foreground/80 leading-relaxed text-[15px]">
                    {s.body.map((b, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-foreground/80 leading-relaxed text-[15px]">{s.body}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
