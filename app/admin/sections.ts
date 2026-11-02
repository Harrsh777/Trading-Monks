/*
 * Describes how each part of content/landing.json appears in the admin
 * dashboard. Paths point into LandingContent; adding a field to the JSON
 * only needs a matching entry here to become editable.
 */

export type Field = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "boolean" | "url" | "image";
  hint?: string;
};

export type Block =
  | { kind: "fields"; path: string; title?: string; fields: Field[] }
  | {
      kind: "list";
      path: string;
      title: string;
      itemName: string;
      /* Field shown as the item's heading in the collapsed list */
      summaryKey?: string;
      /* Omit for lists of plain strings */
      fields?: Field[];
      newItem: unknown;
      fixed?: boolean;
      hint?: string;
    };

export type Section = { id: string; title: string; description: string; blocks: Block[] };

const BOLD_HINT = "Wrap words in **double asterisks** to make them bold.";

export const SECTIONS: Section[] = [
  {
    id: "general",
    title: "General & contact",
    description: "Business details reused across the hero, credentials, contact and footer, plus search engine text.",
    blocks: [
      {
        kind: "fields",
        path: "contact",
        title: "Contact & registration",
        fields: [
          { key: "name", label: "Analyst name" },
          { key: "registration", label: "SEBI registration number" },
          { key: "validity", label: "Registration validity" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone (without +91)" },
          { key: "address", label: "Address", type: "textarea" },
        ],
      },
      {
        kind: "fields",
        path: "seo",
        title: "Search engines (browser tab & Google)",
        fields: [
          { key: "title", label: "Page title" },
          { key: "description", label: "Meta description", type: "textarea" },
        ],
      },
    ],
  },
  {
    id: "nav",
    title: "Navigation",
    description: "Header menu links.",
    blocks: [
      {
        kind: "fields",
        path: "nav",
        fields: [
          { key: "moreLabel", label: "\"More\" dropdown label" },
          { key: "connectLabel", label: "Header button label" },
        ],
      },
      {
        kind: "list",
        path: "nav.primary",
        title: "Main links",
        itemName: "link",
        summaryKey: "label",
        fields: [
          { key: "label", label: "Label" },
          { key: "href", label: "Link target", hint: "A section such as #contact, or a full URL." },
          {
            key: "inquiry",
            label: "Preselect inquiry type",
            hint: "Optional. When the link points to #contact, this inquiry type is selected in the form.",
          },
        ],
        newItem: { label: "New link", href: "#contact", inquiry: "" },
      },
      {
        kind: "list",
        path: "nav.more",
        title: "\"More\" dropdown links",
        itemName: "link",
        summaryKey: "label",
        fields: [
          { key: "label", label: "Label" },
          { key: "href", label: "Link target" },
        ],
        newItem: { label: "New link", href: "#top" },
      },
    ],
  },
  {
    id: "hero",
    title: "01 · Hero",
    description: "The first screen visitors see.",
    blocks: [
      {
        kind: "fields",
        path: "hero",
        fields: [
          { key: "topLine", label: "Top line (registration number is added after it)" },
          { key: "titleLine1", label: "Headline — line 1" },
          { key: "titleLine2", label: "Headline — line 2" },
          { key: "titleHighlight", label: "Headline — gold line" },
          { key: "support", label: "Supporting paragraph", type: "textarea" },
          { key: "primaryButton", label: "Primary button" },
          { key: "secondaryButton", label: "Secondary button" },
          { key: "tickerLabel", label: "Ticker label" },
        ],
      },
      {
        kind: "list",
        path: "hero.ticker",
        title: "Ticker items",
        itemName: "ticker item",
        summaryKey: "name",
        fields: [
          { key: "name", label: "Name" },
          { key: "value", label: "Value" },
          { key: "change", label: "Change" },
          { key: "up", label: "Show as positive (green)", type: "boolean" },
        ],
        newItem: { name: "NEW INDEX", value: "0.00", change: "+0.00%", up: true },
      },
    ],
  },
  {
    id: "market",
    title: "02 · The market",
    description: "Intro section with the candlestick chart.",
    blocks: [
      {
        kind: "fields",
        path: "market",
        fields: [
          { key: "eyebrow", label: "Eyebrow" },
          { key: "title", label: "Heading" },
          { key: "titleHighlight", label: "Heading — gold line" },
          { key: "intro", label: "Paragraph", type: "textarea", hint: BOLD_HINT },
          { key: "badge", label: "Chart badge" },
        ],
      },
      {
        kind: "list",
        path: "market.concepts",
        title: "Concepts",
        itemName: "concept",
        summaryKey: "name",
        fixed: true,
        hint: "These three are pinned to points on the chart, so they can be edited but not added or removed.",
        fields: [
          { key: "index", label: "Number" },
          { key: "name", label: "Title" },
          { key: "text", label: "Text", type: "textarea" },
        ],
        newItem: null,
      },
    ],
  },
  {
    id: "philosophy",
    title: "03 · Philosophy",
    description: "The ivory \"Discipline over Impulse\" section.",
    blocks: [
      {
        kind: "fields",
        path: "philosophy",
        fields: [
          { key: "eyebrow", label: "Eyebrow" },
          { key: "tagline", label: "Tagline (top right)" },
          { key: "titleWord1", label: "Heading — word 1" },
          { key: "titleWord2", label: "Heading — small word" },
          { key: "titleWord3", label: "Heading — word 3" },
          { key: "copy", label: "Paragraph", type: "textarea", hint: BOLD_HINT },
        ],
      },
      {
        kind: "list",
        path: "philosophy.principles",
        title: "Principle cards",
        itemName: "principle",
        summaryKey: "title",
        fixed: true,
        hint: "Each card has its own icon, so there are always three.",
        fields: [
          { key: "number", label: "Number" },
          { key: "tag", label: "Tag" },
          { key: "title", label: "Title" },
          { key: "text", label: "Text", type: "textarea" },
        ],
        newItem: null,
      },
    ],
  },
  {
    id: "strategy",
    title: "04 · Strategy",
    description: "The five-stage scroll animation.",
    blocks: [
      {
        kind: "fields",
        path: "strategy",
        fields: [
          { key: "eyebrow", label: "Eyebrow" },
          { key: "title", label: "Heading" },
          { key: "titleHighlight", label: "Heading — gold line" },
          { key: "intro", label: "Paragraph", type: "textarea", hint: BOLD_HINT },
          { key: "scrollCue", label: "Scroll cue" },
          { key: "panelTicker", label: "Chart panel ticker" },
          { key: "panelBadge", label: "Chart panel badge" },
          { key: "finePrint", label: "Fine print", type: "textarea", hint: BOLD_HINT },
        ],
      },
      {
        kind: "list",
        path: "strategy.stages",
        title: "Stages",
        itemName: "stage",
        summaryKey: "name",
        fixed: true,
        hint: "The scroll animation is choreographed around exactly five stages.",
        fields: [
          { key: "number", label: "Number" },
          { key: "name", label: "Name" },
          { key: "title", label: "Heading" },
          { key: "text", label: "Text", type: "textarea" },
          { key: "label", label: "Small label" },
          { key: "signal", label: "Chart status text" },
        ],
        newItem: null,
      },
    ],
  },
  {
    id: "governance",
    title: "05 · Credentials",
    description: "Governance seal, registration dossier, research framework and disclosures.",
    blocks: [
      {
        kind: "fields",
        path: "governance",
        title: "Heading",
        fields: [
          { key: "eyebrow", label: "Eyebrow" },
          { key: "chip", label: "Chip (registration number is added after it)" },
          { key: "titleLine1", label: "Heading — line 1" },
          { key: "titleLine2", label: "Heading — line 2" },
          { key: "titleHighlight", label: "Heading — gold line" },
          { key: "copy", label: "Paragraph", type: "textarea", hint: BOLD_HINT },
          { key: "verifyLink", label: "Verify link text" },
          { key: "verifyUrl", label: "Verify link URL", type: "url" },
          { key: "sealValidText", label: "Seal — validity text" },
          { key: "sealLocation", label: "Seal — location text" },
        ],
      },
      {
        kind: "list",
        path: "governance.stats",
        title: "Statistics",
        itemName: "statistic",
        summaryKey: "title",
        fixed: true,
        hint: "Each number is animated alongside a ring of the seal, so there are always three.",
        fields: [
          { key: "value", label: "Number", type: "number" },
          { key: "suffix", label: "Suffix (e.g. +)" },
          { key: "tag", label: "Tag" },
          { key: "title", label: "Title" },
          { key: "text", label: "Text", type: "textarea" },
        ],
        newItem: null,
      },
      {
        kind: "fields",
        path: "governance",
        title: "Registration dossier",
        fields: [
          { key: "certEyebrow", label: "Eyebrow" },
          { key: "certTitle", label: "Title" },
          { key: "certStatus", label: "Status chip" },
          { key: "registrationCategory", label: "Registration category" },
          { key: "sebiHeadOffice", label: "SEBI head office", type: "textarea" },
          { key: "certFootnote", label: "Footnote" },
          { key: "certButton", label: "Button" },
        ],
      },
      {
        kind: "fields",
        path: "governance",
        title: "Research framework",
        fields: [
          { key: "capabilitiesEyebrow", label: "Eyebrow" },
          { key: "capabilitiesTitle", label: "Title" },
        ],
      },
      {
        kind: "list",
        path: "governance.lenses",
        title: "Research lenses",
        itemName: "lens",
        summaryKey: "title",
        fixed: true,
        hint: "The three lenses are drawn into the seal.",
        fields: [
          { key: "name", label: "Seal label" },
          { key: "title", label: "Title" },
          { key: "text", label: "Text", type: "textarea" },
        ],
        newItem: null,
      },
      {
        kind: "fields",
        path: "governance",
        title: "Disclosures",
        fields: [
          { key: "disclosuresEyebrow", label: "Eyebrow" },
          { key: "disclosuresTitle", label: "Title" },
        ],
      },
      {
        kind: "list",
        path: "governance.disclosures",
        title: "Disclosure items",
        itemName: "disclosure",
        summaryKey: "title",
        fields: [
          { key: "title", label: "Title" },
          { key: "text", label: "Text", type: "textarea", hint: BOLD_HINT },
        ],
        newItem: { title: "New disclosure", text: "" },
      },
    ],
  },
  {
    id: "testimonials",
    title: "Testimonials",
    description: "The scrolling testimonial cards.",
    blocks: [
      {
        kind: "fields",
        path: "testimonials",
        fields: [
          { key: "title", label: "Heading" },
          { key: "description", label: "Description", type: "textarea" },
        ],
      },
      {
        kind: "list",
        path: "testimonials.items",
        title: "Testimonials",
        itemName: "testimonial",
        summaryKey: "name",
        fields: [
          { key: "name", label: "Name" },
          { key: "handle", label: "Role · City" },
          { key: "avatar", label: "Photo URL", type: "image", hint: "Optional. A link to a square image." },
          { key: "text", label: "Testimonial", type: "textarea" },
        ],
        newItem: { name: "New client", handle: "Role · City", avatar: "", text: "" },
      },
    ],
  },
  {
    id: "contact",
    title: "06 · Contact",
    description: "The contact section and form.",
    blocks: [
      {
        kind: "fields",
        path: "contactSection",
        title: "Left column",
        fields: [
          { key: "eyebrow", label: "Eyebrow" },
          { key: "title", label: "Heading" },
          { key: "titleHighlight", label: "Heading — gold line" },
          { key: "description", label: "Paragraph", type: "textarea", hint: BOLD_HINT },
          { key: "ctaButton", label: "Button" },
          { key: "emailLabel", label: "Email label" },
          { key: "phoneLabel", label: "Phone label" },
          { key: "addressLabel", label: "Address label" },
        ],
      },
      {
        kind: "fields",
        path: "contactSection",
        title: "Form",
        fields: [
          { key: "formEyebrow", label: "Eyebrow" },
          { key: "formTitle", label: "Title" },
          { key: "submitLabel", label: "Submit button" },
          { key: "formMicro", label: "Note under the form" },
          { key: "successTitle", label: "Success — title" },
          { key: "successText", label: "Success — message", type: "textarea" },
          { key: "successButton", label: "Success — button" },
        ],
      },
      {
        kind: "list",
        path: "contactSection.inquiryTypes",
        title: "Inquiry types (dropdown options)",
        itemName: "option",
        newItem: "New inquiry type",
        hint: "The first option is selected by default.",
      },
    ],
  },
  {
    id: "footer",
    title: "07 · Footer",
    description: "Footer links, statement and risk notice.",
    blocks: [
      {
        kind: "fields",
        path: "footer",
        fields: [
          { key: "location", label: "Location" },
          { key: "linkedinUrl", label: "LinkedIn URL", type: "url" },
          { key: "statementTitle", label: "Statement title" },
          { key: "statement", label: "Statement" },
          { key: "copyright", label: "Copyright (year is added before it)" },
          { key: "risk", label: "Risk notice", type: "textarea", hint: BOLD_HINT },
        ],
      },
      {
        kind: "list",
        path: "footer.siteLinks",
        title: "Site links",
        itemName: "link",
        summaryKey: "label",
        fields: [
          { key: "label", label: "Label" },
          { key: "href", label: "Link target" },
        ],
        newItem: { label: "New link", href: "#top" },
      },
      {
        kind: "list",
        path: "footer.legalLinks",
        title: "Legal links",
        itemName: "link",
        summaryKey: "label",
        fields: [
          { key: "label", label: "Label" },
          { key: "href", label: "Link target" },
        ],
        newItem: { label: "New link", href: "/" },
      },
    ],
  },
];
