import React from "react";
import { SEO } from "@/components/seo";
import { motion } from "framer-motion";
import { FileText, Sparkles } from "lucide-react";

const sections: { title: string; body: string | string[] }[] = [
  {
    title: "1. Acceptance of Terms",
    body: `These Terms of Service ("Terms") govern your access to and use of the websites, products, software, APIs, and services (collectively, the "Services") provided by Automystics Technologies Private Limited ("Automystics", "we", "us", or "our"). By accessing or using the Services, you agree to be bound by these Terms. If you are entering into these Terms on behalf of a company or other legal entity, you represent that you have the authority to bind that entity.`,
  },
  {
    title: "2. Eligibility",
    body: `You must be at least 18 years of age and capable of forming a binding contract under applicable law to use the Services. The Services are intended for business and professional use.`,
  },
  {
    title: "3. Accounts & Security",
    body: [
      "You are responsible for maintaining the confidentiality of your account credentials.",
      "You must notify us immediately of any unauthorised use or suspected compromise of your account.",
      "You agree to provide accurate, current, and complete information during registration and to keep such information up to date.",
    ],
  },
  {
    title: "4. License & Use",
    body: `Subject to your compliance with these Terms and any applicable order form or master services agreement, Automystics grants you a limited, non-exclusive, non-transferable, non-sublicensable license to access and use the Services solely for your internal business purposes during the applicable subscription term.`,
  },
  {
    title: "5. Acceptable Use",
    body: [
      "Do not reverse engineer, decompile, or attempt to derive the source code of the Services.",
      "Do not use the Services to transmit malicious code, conduct unauthorised security testing, or interfere with other users.",
      "Do not use the Services to violate any applicable law, regulation, or third-party right.",
      "Do not resell, sublicense, or commercially exploit the Services without our prior written consent.",
    ],
  },
  {
    title: "6. Intellectual Property",
    body: `All right, title, and interest in and to the Services, including all related software, documentation, designs, trademarks, and know-how, remain the exclusive property of Automystics and its licensors. No rights are granted to you other than as expressly set forth in these Terms.`,
  },
  {
    title: "7. Customer Data",
    body: `You retain all rights to data you submit to the Services ("Customer Data"). You grant Automystics a worldwide, non-exclusive license to host, process, and display Customer Data solely as necessary to provide the Services. We process Customer Data in accordance with our Privacy Policy and any applicable Data Processing Agreement.`,
  },
  {
    title: "8. Fees & Payment",
    body: [
      "Fees are specified in the applicable order form, quote, or pricing page.",
      "All fees are non-refundable except as expressly stated in writing.",
      "Late payments may incur interest at 1.5% per month or the maximum rate permitted by law.",
      "All amounts are exclusive of applicable taxes (GST, VAT, withholding), which are your responsibility.",
    ],
  },
  {
    title: "9. Confidentiality",
    body: `Each party agrees to protect the other party's Confidential Information using the same degree of care it uses for its own confidential information (and no less than reasonable care). Confidential Information shall be used solely for purposes of performing under these Terms.`,
  },
  {
    title: "10. Warranties & Disclaimers",
    body: `The Services are provided "as is" and "as available". To the maximum extent permitted by law, Automystics disclaims all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Services will be uninterrupted or error-free.`,
  },
  {
    title: "11. Limitation of Liability",
    body: `To the maximum extent permitted by applicable law, neither party shall be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, revenue, data, or goodwill. Each party's aggregate liability arising out of or related to these Terms shall not exceed the fees paid or payable by you to Automystics in the twelve (12) months preceding the claim.`,
  },
  {
    title: "12. Indemnification",
    body: `You agree to indemnify and hold harmless Automystics, its affiliates, officers, employees, and agents from and against any claims, damages, losses, liabilities, and expenses arising out of (a) your use of the Services in violation of these Terms or applicable law, or (b) Customer Data infringing the rights of any third party.`,
  },
  {
    title: "13. Term & Termination",
    body: `These Terms remain in effect until terminated. Either party may terminate for material breach if the breach is not cured within thirty (30) days of written notice. Upon termination, your right to use the Services ceases immediately. Sections that by their nature should survive termination shall do so.`,
  },
  {
    title: "14. Governing Law & Dispute Resolution",
    body: `These Terms are governed by the laws of India, without regard to conflict-of-law principles. The courts of Coimbatore, Tamil Nadu shall have exclusive jurisdiction over any dispute arising out of or relating to these Terms, subject to mandatory arbitration where applicable under the Arbitration and Conciliation Act, 1996.`,
  },
  {
    title: "15. Changes to Terms",
    body: `We may modify these Terms from time to time. Material changes will be communicated via the Services or by email. Continued use of the Services after such changes constitutes your acceptance of the revised Terms.`,
  },
  {
    title: "16. Contact",
    body: `Questions about these Terms? Contact us at legal@automystics.com or write to: Automystics Technologies Private Limited, Coimbatore, Tamil Nadu, India.`,
  },
];

export function Terms() {
  return (
    <div className="bg-transparent relative">
      <SEO
        title="Terms of Service — Automystics Technologies Private Limited"
        description="Read the Terms of Service governing the use of websites, products, and services provided by Automystics Technologies Private Limited."
        keywords="Automystics terms of service, terms and conditions, SaaS terms, master services agreement, Automystics Technologies terms"
        canonical="/terms"
      />

      <div className="absolute top-0 left-0 right-0 h-[520px] bg-[#0A0612] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[520px] bg-[radial-gradient(ellipse_80%_60%_at_0%_50%,_rgba(8,145,178,0.35),_transparent_60%)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[520px] bg-[radial-gradient(ellipse_80%_60%_at_100%_50%,_rgba(34,211,238,0.28),_transparent_60%)] pointer-events-none" />

      <div className="pt-36 pb-16 relative z-10 overflow-hidden">
        <div className="absolute inset-0 dark-grid-pattern opacity-30 pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center pt-6 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-lg shadow-primary/10 text-primary text-xs font-bold mb-8 uppercase tracking-[0.2em] mx-auto backdrop-blur-md">
              <FileText className="w-3.5 h-3.5" /> LEGAL <span className="w-1 h-1 rounded-full bg-primary" /> Effective: April 17, 2026
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
              Terms of <span className="bg-gradient-to-r from-cyan-400 via-primary to-cyan-300 bg-clip-text text-transparent">Service</span>
            </h1>
            <p className="text-base md:text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
              The agreement that governs your use of Automystics websites, products, and services.
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
