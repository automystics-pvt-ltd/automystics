import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string;
  image?: string;
}

const SITE_URL = "https://automystics.com";
const DEFAULT_IMAGE = `${SITE_URL}/logo.jpeg`;
const DEFAULT_KEYWORDS = [
  "Automystics",
  "Automystics Technologies Private Limited",
  "AI automation company",
  "AI automation Tamil Nadu",
  "AI automation India",
  "enterprise software development",
  "custom software development India",
  "SaaS development company",
  "MVP development",
  "AI integration services",
  "machine learning consulting",
  "voice AI",
  "Kural AI",
  "Fitro360",
  "Fitro360 gym management",
  "gym management software",
  "fitness studio software",
  "gym CRM India",
  "chit fund management software",
  "college management system",
  "school management software",
  "SCADA monitoring",
  "solar plant monitoring",
  "CCTV AI surveillance",
  "algorithmic trading platform",
  "fintech software development",
  "cloud DevOps services",
  "mobile app development",
  "web application development",
  "AI chatbot development",
  "RPA automation",
  "process automation",
  "digital transformation",
  "ISO 27001 software vendor",
];

export function SEO({ title, description, canonical, keywords, image }: SEOProps) {
  const fullTitle = title.includes("Automystics") ? title : `${title} | Automystics Technologies`;
  const url = canonical ? `${SITE_URL}${canonical}` : SITE_URL;
  const ogImage = image ? (image.startsWith("http") ? image : `${SITE_URL}${image}`) : DEFAULT_IMAGE;
  const keywordList = keywords
    ? Array.from(new Set([...keywords.split(",").map((k) => k.trim()).filter(Boolean), ...DEFAULT_KEYWORDS]))
    : DEFAULT_KEYWORDS;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordList.join(", ")} />
      <meta name="author" content="Automystics Technologies Private Limited" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="theme-color" content="#0A0612" />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Automystics Technologies Private Limited" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content="Automystics - An AI Automation Company" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@automystics" />

      {/* Geo */}
      <meta name="geo.region" content="IN-TN" />
      <meta name="geo.placename" content="Tamil Nadu, India" />

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Automystics Technologies Private Limited",
          "legalName": "Automystics Technologies Private Limited",
          "alternateName": "Automystics",
          "url": SITE_URL,
          "logo": `${SITE_URL}/logo.jpeg`,
          "description": "Automystics Technologies Private Limited is an AI Automation Company delivering enterprise-grade custom software, AI integrations, fintech platforms, and industrial automation systems with unprecedented speed.",
          "foundingDate": "2019",
          "address": {
            "@type": "PostalAddress",
            "addressRegion": "Tamil Nadu",
            "addressCountry": "IN",
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer support",
            "email": "hello@automystics.com",
            "areaServed": "Worldwide",
            "availableLanguage": ["English", "Tamil"],
          },
          "sameAs": [
            "https://www.linkedin.com/company/automystics",
            "https://twitter.com/automystics",
          ],
        })}
      </script>
    </Helmet>
  );
}
