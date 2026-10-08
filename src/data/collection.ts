
export type DetailPoint = {
  label: string;
  value: string;
};

export type ChapterData = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  personality: string;
  headline: string;
  subHeadline?: string;
  description: string;
  designElements: string[];
  materials: string[];
  colors: string[];
  imagePrimary: string;
  imageSecondary?: string;
  accentColor: string;
  accentHex: string;
  // Detailed look information
  details: {
    silhouette: string;
    length: string;
    neckline: string;
    closure: string;
    fit: string;
    occasion: string;
    care: string[];
    fabricComposition: string;
    sizing: string;
    features: string[];
  };
};

export const collection: ChapterData[] = [
  {
    id: "prelude",
    index: "01",
    title: "THE PRELUDE",
    subtitle: "ARRIVAL",
    personality: "Sophisticated. Refined. Intentional.",
    headline: "THE NIGHT BEGINS WITH PRESENCE.",
    description: "The first step into the night. An introduction of power through restraint — a garment that commands attention the moment you enter the room.",
    designElements: [
      "Asymmetric one-shoulder cocktail dress",
      "Sculpted structured bodice",
      "Defined waist with hidden boning",
      "Draped hip with cascading fold",
      "Satin / velvet contrast panels",
    ],
    materials: ["Satin", "Velvet"],
    colors: ["Midnight Black", "Antique Gold"],
    imagePrimary: "/images/look-01.jpg",
    accentColor: "var(--color-gold)",
    accentHex: "#C5A059",
    details: {
      silhouette: "A-line cocktail",
      length: "Midi — falls below the knee",
      neckline: "Asymmetric one-shoulder with sculptural drape",
      closure: "Concealed side zip with hook-and-eye finish",
      fit: "Structured and fitted through bodice, relaxed at hip",
      occasion: "Formal events, galas, soirées",
      care: [
        "Dry clean only",
        "Store flat — do not hang",
        "Keep away from direct sunlight",
        "Handle velvet panels with care to preserve pile",
      ],
      fabricComposition: "60% Silk Satin, 30% Crushed Velvet, 10% Elastane",
      sizing: "Available in XS – XXL. Cut true to size. Model wears size S.",
      features: [
        "Internal structured bodice with boning channels",
        "Hand-finished antique gold chain at shoulder",
        "Hidden side zip for seamless silhouette",
        "Velvet pile catching light at hip drape",
        "Fully lined in ivory silk",
      ],
    },
  },
  {
    id: "flapper",
    index: "02",
    title: "THE FLAPPER",
    subtitle: "CELEBRATION",
    personality: "Radiant. Dynamic. Unforgettable.",
    headline: "MOVE LIKE THE NIGHT.",
    subHeadline: "THE HERO GARMENT.",
    description: "The visual centrepiece of the collection. Designed not just to be seen — but to move. Every step, every turn, every moment is a performance.",
    designElements: [
      "Modern 1920s reinterpretation",
      "Straight tubular silhouette",
      "Dropped waist construction",
      "Art Deco geometric beadwork",
      "Sequins & metallic embroidery",
      "Layered fringe & tassel hem",
    ],
    materials: ["Beaded Tulle", "Fringe", "Sequin Net"],
    colors: ["Onyx", "Champagne", "Antique Gold"],
    imagePrimary: "/images/look-02.jpg",
    accentColor: "var(--color-champagne)",
    accentHex: "#F2E3C6",
    details: {
      silhouette: "Straight tubular / shift",
      length: "Mini — above the knee with fringe extension",
      neckline: "Round neck with Art Deco beaded collar",
      closure: "Concealed back zip with jewelled pull",
      fit: "Relaxed through body — falls straight from shoulder",
      occasion: "Gala evenings, celebrations, black-tie",
      care: [
        "Professional dry clean only — no exceptions",
        "Store in garment bag, laid flat",
        "Protect fringe from crushing or folding",
        "Do not expose to moisture — hand-sewn beads are fragile",
      ],
      fabricComposition: "Tulle base with hand-applied glass beads, metallic thread embroidery, and silk fringe",
      sizing: "Available in XS – XL. Cut slightly loose — size down for fitted look. Model wears size XS.",
      features: [
        "Over 8,000 individually hand-sewn glass beads",
        "Art Deco geometric pattern in champagne & onyx",
        "Three-tier fringe hem for maximum movement",
        "Metallic embroidery catches ambient light",
        "Fully lined in nude silk charmeuse",
      ],
    },
  },
  {
    id: "spotlight",
    index: "03",
    title: "THE SPOTLIGHT",
    subtitle: "THE MOMENT",
    personality: "Dramatic. Magnetic. Central.",
    headline: "ALL EYES ON YOU.",
    description: "When the room stops. A garment crafted for the climax of the evening — the moment when all eyes find you and the world holds its breath.",
    designElements: [
      "One-shoulder sculptural neckline",
      "Fitted floor-length silhouette",
      "Dramatic high slit",
      "Architectural waist draping",
      "Detachable train",
    ],
    materials: ["Velvet", "Duchess Satin"],
    colors: ["Deep Emerald Green"],
    imagePrimary: "/images/look-03.jpg",
    accentColor: "var(--color-emerald)",
    accentHex: "#024726",
    details: {
      silhouette: "Column / fitted floor-length gown",
      length: "Floor-length with optional 1.2m detachable train",
      neckline: "One-shoulder with sculptural twisted knot detail",
      closure: "Back zip with fabric-covered buttons from waist to hem",
      fit: "Body-skimming — cut close from bust to thigh",
      occasion: "Galas, award ceremonies, formal dinners, ceremony → nightlife",
      care: [
        "Dry clean only — do not attempt home washing",
        "Train must be stored separately in tissue paper",
        "Steam lightly — never iron velvet directly",
        "Hang on padded hanger to preserve shape",
      ],
      fabricComposition: "85% Duchess Satin in deep emerald, 15% Power net lining for structure",
      sizing: "Available in XS – XXL. Cut fitted — size up if between sizes. Model wears size S.",
      features: [
        "Detachable 1.2m sweep train with hidden press-stud closure",
        "Built-in boned bodice for support without a bra",
        "High slit finished with hand-sewn hem",
        "Sculptural shoulder knot — a single architectural element",
        "Fully lined in ivory power net",
      ],
    },
  },
  {
    id: "afterglow",
    index: "04",
    title: "THE AFTERGLOW",
    subtitle: "THE ENERGY",
    personality: "Powerful. Luminous. Alive.",
    headline: "THE ENERGY. THE POWER.",
    description: "The night is alive. This is not a dress — it is armour. A metallic jumpsuit that moves like liquid silver and commands every room it enters.",
    designElements: [
      "Corset-inspired structured bodice",
      "Deep plunging neckline",
      "Strong architectural shoulders",
      "Defined waist with sculpted seams",
      "Wide-leg palazzo trousers",
      "Metallic statement belt",
    ],
    materials: ["Metallic Jersey", "Liquid Metal Lamé"],
    colors: ["Liquid Silver", "Champagne"],
    imagePrimary: "/images/look-04.jpg",
    accentColor: "var(--color-ivory)",
    accentHex: "#FDFBF7",
    details: {
      silhouette: "Wide-leg jumpsuit with corset bodice",
      length: "Full-length — floor-grazing at front, slight sweep at back",
      neckline: "Plunging V-neck with structured lapel edge",
      closure: "Side zip concealed beneath metallic panel",
      fit: "Structured and boned through bodice, fluid and wide through leg",
      occasion: "High-fashion events, parties, concerts, editorial",
      care: [
        "Dry clean only — metallic lamé requires specialist handling",
        "Store flat to preserve metallic surface",
        "Avoid friction — metallic threads can snag",
        "Do not expose to heat — lamé will dull",
      ],
      fabricComposition: "70% Polyester Metallic Lamé, 20% Viscose Jersey, 10% Elastane",
      sizing: "Available in XS – XL. Cut close through bodice, generous through leg. Model wears size S.",
      features: [
        "Internal boning and corsetry in bodice for shape and support",
        "Removable metallic belt with statement rectangular buckle",
        "Palazzo-cut leg for dramatic movement",
        "Reflective metallic surface reacts dynamically to light",
        "Lined in champagne silk to prevent static",
      ],
    },
  },
  {
    id: "midnight-rebel",
    index: "05",
    title: "MIDNIGHT REBEL",
    subtitle: "LAST DANCE",
    personality: "Edgy. Fearless. Unapologetic.",
    headline: "LAST DANCE.",
    subHeadline: "FEARLESS AFTER MIDNIGHT.",
    description: "For the final hours. When the night belongs only to the bold. Darker, sharper, and utterly undeniable — this is the look that owns the last dance.",
    designElements: [
      "Asymmetric black + burgundy mini dress",
      "Structured corset bodice",
      "One dramatic long sleeve",
      "One bare sculptural shoulder",
      "Sheer mesh panels at waist",
      "Sculptural hip seaming",
      "Metallic hardware detailing",
    ],
    materials: ["Velvet", "Sheer Mesh", "Metal Hardware"],
    colors: ["Onyx Black", "Burgundy"],
    imagePrimary: "/images/look-05.jpg",
    accentColor: "var(--color-burgundy)",
    accentHex: "#5B0E16",
    details: {
      silhouette: "Asymmetric structured mini",
      length: "Mini — mid-thigh",
      neckline: "Off-shoulder on one side, sculptural sleeve on the other",
      closure: "Back zip with antique silver hardware pull",
      fit: "Very fitted and structured throughout",
      occasion: "Late-night events, after-parties, editorial, concerts",
      care: [
        "Dry clean only",
        "Handle metallic hardware carefully — protect from scratches",
        "Store hanging on padded hanger",
        "Avoid catching sheer mesh panels on sharp objects",
      ],
      fabricComposition: "55% Velvet, 25% Sheer Mesh, 15% Structured Fusible Interlining, 5% Metallic Hardware",
      sizing: "Available in XS – XL. Cut very fitted — size up for comfort. Model wears size XS.",
      features: [
        "Antique silver chain and hardware at waist and sleeve cuff",
        "Boned corset bodice with internal structure",
        "Sheer mesh waist panel for subtle reveal",
        "Asymmetric hem — longer at back",
        "Fully lined in onyx silk",
      ],
    },
  },
];

export const brandPhilosophy = [
  "TIMELESS GLAMOUR",
  "EXCEPTIONAL CRAFTSMANSHIP",
  "MODERN FEMININITY",
  "INDIVIDUAL EXPRESSION",
  "CONFIDENCE WITHOUT COMPROMISE"
];

export const materialsList = [
  { name: "SATIN", desc: "LIQUID REFLECTION" },
  { name: "VELVET", desc: "DEPTH / ABSORPTION" },
  { name: "BEADED TULLE", desc: "TEXTURAL LIGHT" },
  { name: "METALLIC JERSEY", desc: "FLUID ARMOR" },
  { name: "FRINGE", desc: "MOVEMENT / RHYTHM" },
  { name: "LIQUID METAL", desc: "PURE REFLECTION" }
];
