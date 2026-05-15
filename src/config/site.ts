export const site = {
  name: "AI-Ops",
  domain: "ai-ops.dk",
  url: "https://ai-ops.dk",
  tagline: "AI-konsulent i Danmark · AI-infrastruktur der kommer i produktion",
  description:
    "Uafhængig AI-konsulent der hjælper danske organisationer — privat og offentlig — med robust AI-infrastruktur og AI i produktion, dér hvor det skaber målbar værdi.",
  owner: {
    name: "Lars W. Andersen",
    role: "AI-konsulent og rådgiver",
    email: "lars@ai-ops.dk",
    phone: "+45 20 46 80 20",
    linkedin: "https://www.linkedin.com/in/larswa/",
    location: "Danmark",
  },
  company: {
    legalName: "Factus Consulting ApS",
    address: "Rørløkken 62, 2730 Herlev",
    cvr: "36900725",
  },
  related: {
    factus: "https://factus.dk",
  },
  nav: [
    { label: "Ydelser", href: "/#ydelser" },
    { label: "DevOps & Platform ↗", href: "https://factus.dk", external: true },
    { label: "Cases", href: "/cases" },
    { label: "Blog", href: "/blog" },
    { label: "Om mig", href: "/#om-mig" },
    { label: "Kontakt", href: "/#kontakt" },
  ],
} as const;
