import { CapabilityStatement, UserProfile } from './types';

export const INITIAL_PROFILE: UserProfile = {
  companyName: "LTM Civil & Logistics SA",
  registrationNumber: "2018/439201/07",
  bbbeeLevel: "1",
  csdNumber: "MAAA0593821",
  cidbGrade: "6CE",
  contactEmail: "info@ltmcivil.co.za",
  contactPhone: "+27 (0) 11 402 3921",
  physicalAddress: "Building 4, Sandton Corporate Rise, Sandton, Johannesburg, 2196",
  industry: "Construction, Logistics & Civil Engineering"
};

export const INITIAL_STATEMENTS: CapabilityStatement[] = [
  {
    id: "proj-1",
    title: "Durban Logistics RFP Statement",
    templateId: "corporate",
    companyName: "LTM Civil & Logistics SA",
    registrationNumber: "2018/439201/07",
    bbbeeLevel: "1",
    overview: "LTM Civil & Logistics SA is a robust, black-owned multidisciplinary construction and logistics agency. Operating out of Gauteng and KwaZulu-Natal, we provide world-class bulk freight transport, heavy machinery sourcing, and complete civil engineering solutions. As a Level 1 B-BBEE contributor registered with the CIPC and fully credentialed on the Central Supplier Database, we deliver public infrastructure and transport programs on schedule, with absolute safety compliance.",
    csdNumber: "MAAA0593821",
    cidbGrade: "6CE",
    contactEmail: "tender@ltmcivil.co.za",
    contactPhone: "+27 (0) 31 829 4021",
    physicalAddress: "Gate 4, Durban Port Terminal Road, Durban, 4001",
    services: [
      "Bulk Freight Logistics & Container Sourcing",
      "Heavy Earthmoving & Civil Plant Machinery Leasing",
      "Road Rehabilitation & Infrastructure Civil Sourcing",
      "Sustainable Aggregates Supply & Last-Mile Delivery"
    ],
    differentiators: [
      "Level 1 B-BBEE rating giving 135% procurement recognition",
      "CIPC & CSD certified with clean compliance track record",
      "Strict compliance with National Treasury transport policies",
      "24/7 real-time bulk vehicle performance satellite tracking"
    ],
    certifications: [
      "SABS ISO 9001:2015 Approved Quality Management",
      "CIDB Grade 6CE (Civil Engineering)",
      "Road Freight Association Active Member License"
    ],
    pastPerformance: [
      {
        id: "perf-1-1",
        projectName: "Durban Port Container Sourcing RFP",
        client: "Transnet National Ports Authority (TNPA)",
        value: 12500000,
        year: 2024,
        status: "completed",
        description: "Provided rapid turnaround container logistics and storage optimization during season-peak cargo backlogs. Managed over 15 bulk hauling units daily with zero incidents."
      },
      {
        id: "perf-1-2",
        projectName: "Coega Special Economic Zone Site Works",
        client: "Coega Development Corporation (CDC)",
        value: 6800000,
        year: 2023,
        status: "completed",
        description: "Excavation, grading, and sustainable soil stabilization for new manufacturing warehouse footprints cover."
      }
    ],
    lastEdited: "2024-10-24"
  },
  {
    id: "proj-2",
    title: "SME Tech Grant Application",
    templateId: "digital",
    companyName: "TechFrontier Solutions",
    registrationNumber: "2021/839201/07",
    bbbeeLevel: "2",
    overview: "TechFrontier Solutions is an innovative ICT enterprise dedicated to bridging the digital divide in South Africa. We design cloud-native software architectures, localization intelligence engines, and community-guided digital dashboards. Our focus lies in providing South African municipalities and financial technology channels with secure, highly scalable platforms crafted to local linguistic requirements.",
    csdNumber: "MAAA0921029",
    cidbGrade: "Not Applicable",
    contactEmail: "grants@techfrontier.za",
    contactPhone: "+27 (0) 12 948 2019",
    physicalAddress: "Innovate Hub, Lynnwood Road, Pretoria, 0081",
    services: [
      "SaaS Custom Software & Local Language NLP Dev",
      "Municipal e-Commerce & Utility Payment Pathways",
      "Cloud Architecture Support & Security Auditing"
    ],
    differentiators: [
      "Indigenous language translation matching rural South African users",
      "Compliance with Protection of Personal Information Act (POPIA)",
      "Highly responsive mobile-first UI tailored for low-bandwidth environments"
    ],
    certifications: [
      "AWS Certified Solutions Architecture Partner",
      "SITA Accredited Software Supplier Framework",
      "POPIA Compliance Audited Standard"
    ],
    pastPerformance: [
      {
        id: "perf-2-1",
        projectName: "e-Tshwane Portal Mobile Optimization",
        client: "City of Tshwane Municipality",
        value: 4200000,
        year: 2023,
        status: "completed",
        description: "Re-engineered the mobile web payment channel, improving loading speeds by 60% and enabling integrated USSD payment support for local communities."
      }
    ],
    lastEdited: "2024-10-22"
  },
  {
    id: "proj-3",
    title: "Pretoria Infrastructure Bid",
    templateId: "tender",
    companyName: "LTM Civil & Logistics SA",
    registrationNumber: "2018/439201/07",
    bbbeeLevel: "1",
    overview: "A compliant technical submission for civil works in the Pretoria metropolitan area. Tailored fully for eTender specifications, featuring precise CIDB verification, SABS guidelines, and local citizen placement strategies to satisfy National Treasury tender assessment matrixes.",
    csdNumber: "MAAA0593821",
    cidbGrade: "6CE",
    contactEmail: "bids@ltmcivil.co.za",
    contactPhone: "+27 (0) 11 402 3921",
    physicalAddress: "Building 4, Sandton Corporate Rise, Sandton, 2196",
    services: [
      "Bulk Water Reticulation & Sewer Pipe Rehabilitation",
      "Concrete Stormwater Channel Design & Implementation",
      "Municipal Trenching, Road Crossings, and Site Clearing"
    ],
    differentiators: [
      "Active CIDB 6CE rating with full capacity limit eligibility",
      "80% local labor procurement guarantee in target Tshwane wards",
      "Subcontracting structure fully aligned with PPPFA regulations"
    ],
    certifications: [
      "CIDB Grade 6CE (Civil Engineering)",
      "NHBRC Registered Home and Institutional Builder",
      "SABS Concrete Strengths Standard Approval Certificate"
    ],
    pastPerformance: [
      {
        id: "perf-3-1",
        projectName: "Gauteng School Sanitation Infrastructure Redesign",
        client: "Gauteng Department of Infrastructure Development (GDID)",
        value: 15400000,
        year: 2023,
        status: "completed",
        description: "Replaced legacy sewer structures with modern, healthy water-efficient reticulation pipelines in 12 community schools."
      }
    ],
    lastEdited: "2024-10-18"
  },
  {
    id: "proj-4",
    title: "CSD Compliance Review",
    templateId: "boutique",
    companyName: "Sovereign Consulting Partners",
    registrationNumber: "2015/093281/07",
    bbbeeLevel: "1",
    overview: "Sovereign Consulting Partners delivers premium advisory, transaction support, and CSD registration compliance auditing to medium-sized South African enterprises. We assist business owners in aligning their scorecards, cleaning regulatory compliance errors, and preparing winning documentation suites for municipal bids.",
    csdNumber: "MAAA0721839",
    cidbGrade: "Not Applicable",
    contactEmail: "legal@sovereignpartners.co.za",
    contactPhone: "+27 (0) 11 884 9291",
    physicalAddress: "9th Floor, Michelangelo Towers, Maude St, Sandton, 2196",
    services: [
      "B-BBEE Scorecard Optimization Planning",
      "CSD Verification Compliance Audits",
      "Corporate Bid Writing Mentorship Packages"
    ],
    differentiators: [
      "Managed by former municipal treasury audit heads",
      "100% record of successful Central Supplier Database verifications",
      "Highly localized tender monitoring platform with daily alerts"
    ],
    certifications: [
      "South African Institute of Chartered Accountants (SAICA) Registered",
      "SANAS B-BBEE Verifications Agent Alliance Partnership"
    ],
    pastPerformance: [
      {
        id: "perf-4-1",
        projectName: "BEE Compliance Audit Support Scheme",
        client: "Vaal Water Engineers (Pty) Ltd",
        value: 850000,
        year: 2024,
        status: "completed",
        description: "Re-structured vaal engineering corporate shareholders schema to boost B-BBEE rating from Level 4 to Level 1 in less than 90 days."
      }
    ],
    lastEdited: "2024-10-15"
  }
];

export interface TemplateStyle {
  id: string;
  name: string;
  description: string;
  tagline: string;
  colors: {
    primary: string; // Tailwind color name
    secondary: string;
    background: string;
    accent: string;
    border: string;
  };
  fontFamily: string;
  imageUrl: string;
  imageAlt: string;
}

export const TEMPLATES_CONFIG: TemplateStyle[] = [
  {
    id: "corporate",
    name: "Executive Corporate",
    description: "High-density information design for blue-chip tender submissions and partnerships. Elegant navy & gold borders styling.",
    tagline: "Corporate Light",
    colors: {
      primary: "bg-[#000e27] text-white",
      secondary: "text-[#0040a2]",
      background: "bg-[#f6faff]",
      accent: "border-[#a88642]",
      border: "border-slate-200"
    },
    fontFamily: "font-[Montserrat]",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuARaI3aPIh0BbDNMBDhv_RL_wRTtzDmTdmUsXXbOR9VpUuiTiX49WrWMN-mw3bIdRXBVJoQ3fMb2L-Wp4KkiQ6g-OzuddVrWR3OjOmezkJVNqPtQm3pUp8ubgtrMADoZN6M2Qvub-vnMB7rDFueQq2u1a9MzIfBQY6BwrP6eMqA4a1tpymT4NQggW562KsENGpjFdg_00WwgsIjOdE8Iiu6QyVCbBdcjslsU35WzgE4vY8qM7G6RCA3HoPZ8jF0oXxeG4teaCbOrA",
    imageAlt: "Executive Corporate capability statement layout featuring high density columns and navy gold styling"
  },
  {
    id: "tender",
    name: "Tender Protocol",
    description: "Optimized for National Treasury and eTenders Portal compliance. Formal administrative guidelines formatting.",
    tagline: "BEE Level 1 Focus",
    colors: {
      primary: "bg-[#0b3c20] text-white", // Green themed representing SA agriculture/land & treasury
      secondary: "text-[#9e7a28]",
      background: "bg-[#fcfdfa]",
      accent: "border-[#9e7a28]",
      border: "border-emerald-200"
    },
    fontFamily: "font-[Montserrat]",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBODZztO1AGQHl83KXod82cFIc9URoT1tunluRF-SjuxMbp0yPQZWZsYuOGgNB6OpuNxP3JrWQm9poBymFM3Sb7l-xtO1pPXpHBl6hEMJcu2N0mb3CQOSHHw4fG7a3-AVExRGA2hi-kWcsu7KonrlhlJo9f9DVR4lPtY-3aEWji8Pr5v4tH8AUNy6fuf3r3AQblGvJCTzIDj06Rb_VDNi7uIxMCmjCvuBTyirfovAADSl6wVulrE9ImopKd3mjXdAva3f5VHmYoxA",
    imageAlt: "Tender Protocol design with formal South African green and gold aesthetics tailored for national bidding"
  },
  {
    id: "infrabuild",
    name: "InfraBuild Elite",
    description: "Showcase heavy projects, safety compliance, and engineering credentials effectively. Slate and industrial accents.",
    tagline: "Engineering Focus",
    colors: {
      primary: "bg-[#1e293b] text-white", // Slate dark
      secondary: "text-[#0284c7]", // Sky blue
      background: "bg-[#f8fafc]",
      accent: "border-slate-400",
      border: "border-slate-300"
    },
    fontFamily: "font-[Inter]",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAY3G9a_XeEvYPJv1ejqqt3q5xTBdhqvOiI2uclf0SYgt8SwZO9RtRIetXne4kM5Vl_IFxlzg-1boz2oW2WlAqrVsTVmXeDBz5p-h6ktxE-cGlg_qEAJiXhnfnfvMcqRkrgLEswIpjEovmfTk7F2JU5alVSdOIICPG6WD2IgvUpdf20aISLu9zSugCJCBtiWoIv-PucQN_3IZLDN1xz9mUrFW0SLCyHznFVUoRUgUQiMI7CiYAQOr0luItK7CnDeSkXcx49UvOpWA",
    imageAlt: "InfraBuild heavy utility theme with rugged structure paths for infrastructure groups"
  },
  {
    id: "digital",
    name: "Digital Transformation",
    description: "Clean, tech-forward aesthetic for software, networking, and IT infrastructure firms. Gradient modern details.",
    tagline: "Tech/Modern Grade",
    colors: {
      primary: "bg-[#0f172a] text-white",
      secondary: "text-[#3b82f6]", // Royal blue
      background: "bg-[#fafbff]",
      accent: "border-[#3b82f6]",
      border: "border-indigo-100"
    },
    fontFamily: "font-[Inter]",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUPCwv9scbFuHg5wXVaPpagl4JL_oCJ2RGAfPStxCrJjpa4ljuYbsWnrF-dlTHyNjcp1JZfLlUhYL7EWPXDL2S2tltW44vbHwE_645orUBPh7fjkDwVhhsWWkuGtNy8kI5O2_GbS9pxZk-UnewJOB98_SktveUyugwFbGjQ1rFuQrQnVMt9myetDw2JBw4OIJGCuoS19zDNvvDgyWtGk3gz84HgYh0gDfKfImQlcCHT5MU64ey0hb9s5uLqmOqfqcp9_KHLqA-Rw",
    imageAlt: "Slick IT capability layout featuring deep interactive circuitry styling and digital metrics"
  },
  {
    id: "boutique",
    name: "Boutique Agency",
    description: "Minimalist and refined for consultancies and specialized advisory firms. Elegant margins and warm sepia details.",
    tagline: "Sophisticated / Luxe",
    colors: {
      primary: "bg-[#27272a] text-white", // Zinc dark
      secondary: "text-[#d4af37]", // Metallic gold
      background: "bg-[#fcfaf7]",
      accent: "border-[#d4af37]",
      border: "border-stone-200"
    },
    fontFamily: "font-[#style]",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBoPGSezFdgrdHb7bJG-6ZPQjaCFBFkv0jAswQZ6J1eNuG5fjI9QeuqdHvewsbdZj_RjJ2YhHCdaIQOXnZKrIrBbVJ1-jxLt5uJK8yiIJZnW7jfuULoNP5PTMkBb85LFu0wCrDuwdqD5V-rJLYGSeIjY4hCHXYL4A_2yVjmDd_VCS-4YzqEDFRg_WM0yb_I6fyBpDV7Qm3TGRUhtbO-kxod4l1fqy71iWgNsqzkjAy0EzbYIcz78vk_miDLsw1dkiIM8VyLQiQgzg",
    imageAlt: "A sophisticated warm editorial-toned layout tailored for consultancies and modern boutiques"
  }
];
