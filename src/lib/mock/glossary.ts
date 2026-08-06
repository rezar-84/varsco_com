/**
 * Aquaculture glossary.
 *
 * Definitions are deliberately qualitative. Where a number appears it is one
 * this site already publishes elsewhere (the ≥ 85 % hatch-rate guarantee, the
 * 20–24 h hatching window and the 25–35 ppt / 28–30 °C incubation band from
 * the Artemia incubation manual), so the glossary can never drift away from
 * the protocol pages. Nothing here invents a figure to sound authoritative —
 * see doc/quality_assurance.md § Content Accuracy Gate.
 *
 * English is the source of truth. Each entry is translatable through the same
 * override convention products use: `glossary.term.<slug>.term` and
 * `glossary.term.<slug>.definition`, falling back to the English below when a
 * locale has no override yet.
 */

export type GlossaryCategoryKey =
  "live-feed" | "hatchery" | "salmonid" | "health" | "feed" | "export";

export interface GlossaryTerm {
  slug: string;
  term: string;
  /** Expanded form of an acronym, shown next to the term. */
  abbr?: string;
  definition: string;
  category: GlossaryCategoryKey;
  /** Slugs of related entries, rendered as in-page jump links. */
  seeAlso?: string[];
  /** Catalogue entry this term describes, if any. */
  product?: { category: string; slug: string };
  /** Guide or landing page that covers the term in depth. */
  guide?:
    | "/decapsulated-artemia-guide"
    | "/artemia-cysts-incubation-guide"
    | "/salmonid-ova-solutions"
    | "/seafood-export"
    | "/horeca-seafood-middle-east";
}

export const GLOSSARY_CATEGORIES: { key: GlossaryCategoryKey; label: string }[] = [
  { key: "live-feed", label: "Live Feed & Artemia" },
  { key: "hatchery", label: "Hatchery & Larval Rearing" },
  { key: "salmonid", label: "Salmonid Ova & Genetics" },
  { key: "health", label: "Health, Biosecurity & Certification" },
  { key: "feed", label: "Feed & Nutrition" },
  { key: "export", label: "Seafood Export & Trade" },
];

export const GLOSSARY: GlossaryTerm[] = [
  // ---------------------------------------------------------------- live feed
  {
    slug: "live-feed",
    term: "Live Feed",
    category: "live-feed",
    definition:
      "Any living organism cultured and fed to farmed larvae — Artemia, rotifers, copepods and microalgae. Larvae of most marine species will not accept an inert diet at first feeding, which is what makes live feed unavoidable rather than merely preferable.",
    seeAlso: ["artemia", "rotifer", "copepods", "weaning"],
  },
  {
    slug: "artemia",
    term: "Artemia",
    abbr: "brine shrimp",
    category: "live-feed",
    definition:
      "A genus of small crustaceans that live in hypersaline lakes and salt ponds. Their dormant cysts can be dried, stored and hatched on demand, which is why Artemia became the standard live feed in fish and shrimp hatcheries worldwide.",
    seeAlso: ["artemia-cysts", "nauplii", "instar-i"],
    product: { category: "live-feed-aquaculture", slug: "artemia" },
  },
  {
    slug: "artemia-cysts",
    term: "Artemia Cysts",
    category: "live-feed",
    definition:
      "Dormant Artemia embryos, each sealed inside a hard shell and harvested from hypersaline water, then cleaned and dried. In dry storage they remain viable for years; rehydration in salt water restarts embryonic development.",
    seeAlso: ["chorion", "hatching-rate", "cpg"],
    product: { category: "live-feed-aquaculture", slug: "artemia" },
  },
  {
    slug: "nauplii",
    term: "Nauplii",
    category: "live-feed",
    definition:
      "The free-swimming first larval stage released when an Artemia cyst hatches. Their size and jerky swimming motion trigger the feeding response of marine fish larvae, which hunt by sight.",
    seeAlso: ["instar-i", "instar-ii", "npg"],
  },
  {
    slug: "instar-i",
    term: "Instar I",
    category: "live-feed",
    definition:
      "The newly hatched Artemia nauplius, before its first moult. Its mouth and anus are not yet open, so it still lives entirely on its yolk reserve — this is the point of maximum energy content per individual, and the reason many hatcheries feed nauplii as soon as possible after harvest.",
    seeAlso: ["instar-ii", "nauplii"],
  },
  {
    slug: "instar-ii",
    term: "Instar II",
    category: "live-feed",
    definition:
      "The stage following the first moult, when the nauplius opens its mouth and begins to filter-feed. It has consumed part of its yolk reserve, so it carries less energy per individual than Instar I — but because it now feeds, it can be enriched.",
    seeAlso: ["instar-i", "enrichment"],
  },
  {
    slug: "decapsulation",
    term: "Decapsulation",
    category: "live-feed",
    definition:
      "A chemical hydration and oxidation process that dissolves the outer chorion while leaving the living embryo intact inside its membrane. Decapsulated cysts can be fed directly without a hatching step, and carry no shell to separate out.",
    seeAlso: ["chorion", "artemia-cysts"],
    guide: "/decapsulated-artemia-guide",
    product: { category: "hatchery-solutions", slug: "decapsulated-dry-artemia-cysts" },
  },
  {
    slug: "chorion",
    term: "Chorion",
    category: "live-feed",
    definition:
      "The hard outer shell of an Artemia cyst. It is indigestible and can obstruct larval guts, so empty shells must be separated from hatched nauplii before feeding — a step decapsulated cysts remove entirely.",
    seeAlso: ["decapsulation", "hatch-out"],
  },
  {
    slug: "hatching-rate",
    term: "Hatching Rate",
    category: "live-feed",
    definition:
      "The percentage of cysts that hatch into live nauplii under standard incubation conditions. Together with the nutritional value of the resulting nauplii it is the meaningful measure of cyst quality. VARS guarantees a stable rate of at least 85 %.",
    seeAlso: ["cpg", "npg", "hatch-out"],
    guide: "/artemia-cysts-incubation-guide",
  },
  {
    slug: "cpg",
    term: "CPG",
    abbr: "Cysts Per Gram",
    category: "live-feed",
    definition:
      "The number of cysts contained in one gram. CPG varies with the size and genus of the Artemia and is not a quality indicator on its own — a high count of cysts that do not hatch feeds nothing.",
    seeAlso: ["npg", "hatching-rate"],
  },
  {
    slug: "npg",
    term: "NPG",
    abbr: "Nauplii Per Gram",
    category: "live-feed",
    definition:
      "The number of live nauplii actually produced per gram of cysts. Because it combines cyst count with hatching rate, it describes what a hatchery can genuinely put in the tank — which CPG alone does not.",
    seeAlso: ["cpg", "hatching-rate"],
  },
  {
    slug: "hatch-out",
    term: "Hatch-Out Window",
    category: "live-feed",
    definition:
      "The elapsed time between hydrating cysts and harvesting nauplii — typically 20–24 hours under the recommended conditions. A narrow, synchronous window means most nauplii are harvested at the same instar, and so at a uniform energy value.",
    seeAlso: ["instar-i", "hatching-rate"],
    guide: "/artemia-cysts-incubation-guide",
  },
  {
    slug: "incubation-parameters",
    term: "Incubation Parameters",
    category: "live-feed",
    definition:
      "The controlled conditions under which cysts are hatched: salinity of 25–35 ppt, water held at 28–30 °C, continuous strong aeration keeping cysts in suspension, and continuous light. Departing from them lowers and desynchronises the hatch.",
    seeAlso: ["hatch-out", "hatching-rate", "salinity"],
    guide: "/artemia-cysts-incubation-guide",
  },
  {
    slug: "salinity",
    term: "Salinity",
    abbr: "ppt",
    category: "live-feed",
    definition:
      "Dissolved salt concentration, expressed in parts per thousand (ppt) or grams per litre. Artemia cysts hatch across a broad band, but low salinity prolongs hatching time and spreads the hatch-out window.",
    seeAlso: ["incubation-parameters"],
  },
  {
    slug: "enrichment",
    term: "Enrichment",
    category: "live-feed",
    definition:
      "Holding filter-feeding live feed in a suspension of a lipid emulsion or microalgae so it fills its gut before being fed to larvae. Enrichment is how essential fatty acids that Artemia does not naturally carry in quantity reach the larva.",
    seeAlso: ["bioencapsulation", "hufa", "instar-ii"],
  },
  {
    slug: "bioencapsulation",
    term: "Bioencapsulation",
    category: "live-feed",
    definition:
      "Using a live organism as a delivery vehicle: nutrients, pigments or veterinary treatments are ingested by the rotifer or Artemia and passed on to the larva that eats it. The mechanism behind enrichment.",
    seeAlso: ["enrichment", "hufa"],
  },
  {
    slug: "rotifer",
    term: "Rotifer",
    abbr: "Brachionus",
    category: "live-feed",
    definition:
      "Microscopic filter-feeding zooplankton, cultured as the first live feed for marine larvae whose mouths are still too small to take Artemia nauplii. Rotifer cultures are themselves fed on microalgae.",
    seeAlso: ["chlorella", "artemia", "green-water"],
  },
  {
    slug: "chlorella",
    term: "Chlorella",
    category: "live-feed",
    definition:
      "A single-celled green microalga used as the feed for rotifer cultures and for green water in larval tanks. It is also used to enrich Artemia nauplii before they are fed out — a distinct use from feeding rotifers.",
    seeAlso: ["rotifer", "green-water", "enrichment"],
    product: { category: "live-feed-aquaculture", slug: "emerald-chlorella-powder" },
  },
  {
    slug: "green-water",
    term: "Green Water Technique",
    category: "live-feed",
    definition:
      "Adding microalgae directly to the larval tank. The suspension diffuses light and reduces reflection so larvae locate prey more readily, stabilises water chemistry, and keeps live feed nutritionally conditioned between feeds.",
    seeAlso: ["chlorella", "rotifer"],
  },
  {
    slug: "copepods",
    term: "Copepods",
    category: "live-feed",
    definition:
      "Small crustacean zooplankton and the natural prey of most marine fish larvae. They are used where a smaller or nutritionally more complete first feed than rotifers is needed, though they are harder to culture at scale.",
    seeAlso: ["rotifer", "live-feed"],
  },
  {
    slug: "co-feeding",
    term: "Co-Feeding",
    category: "live-feed",
    definition:
      "Offering live feed and formulated micro-feed together for a period, so larvae learn to accept an inert diet before live feed is withdrawn. Shortens weaning and reduces the mortality that an abrupt switch causes.",
    seeAlso: ["weaning", "micro-feed"],
  },
  {
    slug: "weaning",
    term: "Weaning",
    category: "live-feed",
    definition:
      "The transition from live feed onto formulated dry feed. It is one of the costlier and more failure-prone phases of hatchery production, which is why it is normally staged through co-feeding.",
    seeAlso: ["co-feeding", "micro-feed"],
  },

  // ----------------------------------------------------------------- hatchery
  {
    slug: "hatchery",
    term: "Hatchery",
    category: "hatchery",
    definition:
      "The facility that holds broodstock, produces and incubates eggs, and rears larvae through to juveniles for on-growing farms. Everything downstream in a production cycle inherits the quality decided here.",
    seeAlso: ["broodstock", "larval-rearing", "fingerling"],
  },
  {
    slug: "broodstock",
    term: "Broodstock",
    category: "hatchery",
    definition:
      "The mature adults kept to produce eggs and milt. Their genetics, condition and health status set the ceiling for every batch of offspring, so broodstock nutrition and screening are treated as production inputs, not overhead.",
    seeAlso: ["spawning", "bkd", "spf"],
  },
  {
    slug: "spawning",
    term: "Spawning",
    category: "hatchery",
    definition:
      "The release and collection of eggs and milt. In controlled hatcheries it is timed by manipulating photoperiod and temperature so that egg batches arrive when the larval infrastructure is ready for them.",
    seeAlso: ["broodstock", "photoperiod", "green-eggs"],
  },
  {
    slug: "larval-rearing",
    term: "Larval Rearing",
    category: "hatchery",
    definition:
      "The phase between hatching and metamorphosis, during which the animal depends on live feed and is most sensitive to water quality, light and feed timing. Survival through this phase largely determines a hatchery's economics.",
    seeAlso: ["live-feed", "metamorphosis", "swim-bladder"],
  },
  {
    slug: "fry",
    term: "Fry",
    category: "hatchery",
    definition:
      "A young fish that has absorbed its yolk sac and begun to feed independently. The term marks the point at which the animal must be fed rather than merely kept alive.",
    seeAlso: ["fingerling", "larval-rearing"],
  },
  {
    slug: "fingerling",
    term: "Fingerling",
    category: "hatchery",
    definition:
      "A juvenile fish grown on past the fry stage and large enough to transfer to grow-out cages or ponds. Usually the commercial handover point between hatchery and farm.",
    seeAlso: ["fry", "grading"],
  },
  {
    slug: "post-larvae",
    term: "Post-Larvae",
    abbr: "PL",
    category: "hatchery",
    definition:
      "Shrimp that have completed their larval stages and resemble miniature adults. They are traded by age — PL10, PL15 — counting days since reaching the post-larval stage.",
    seeAlso: ["micro-feed", "decapsulation"],
  },
  {
    slug: "swim-bladder",
    term: "Swim Bladder Inflation",
    category: "hatchery",
    definition:
      "The narrow early window in which marine larvae must reach the surface and gulp air to inflate the swim bladder. Larvae that miss it develop spinal and buoyancy deformities and are downgraded at harvest, so surface films are managed carefully during this period.",
    seeAlso: ["larval-rearing", "grading"],
  },
  {
    slug: "ras",
    term: "RAS",
    abbr: "Recirculating Aquaculture System",
    category: "hatchery",
    definition:
      "A tank-based system that treats and reuses its water through mechanical filtration, biofiltration and disinfection instead of exchanging it. It buys control over temperature, photoperiod and biosecurity at the cost of technical complexity.",
    seeAlso: ["biofilter", "stocking-density", "biosecurity"],
  },
  {
    slug: "biofilter",
    term: "Biofilter",
    category: "hatchery",
    definition:
      "The stage of a recirculating system where nitrifying bacteria oxidise ammonia excreted by the stock into nitrite and then nitrate. A biofilter takes weeks to mature, which is why RAS units are started well before fish arrive.",
    seeAlso: ["ras"],
  },
  {
    slug: "photoperiod",
    term: "Photoperiod",
    category: "hatchery",
    definition:
      "The controlled day-length regime applied to a stock. Manipulating it shifts maturation and spawning timing, and in salmonids is central to controlling smoltification and early maturation.",
    seeAlso: ["spawning", "smoltification"],
  },
  {
    slug: "stocking-density",
    term: "Stocking Density",
    category: "hatchery",
    definition:
      "The quantity of animals held per unit of tank volume or cage area, expressed as numbers or biomass. It drives oxygen demand, waste load and social stress, so it is a limit set by system capacity rather than a target to maximise.",
    seeAlso: ["ras", "grading"],
  },
  {
    slug: "grading",
    term: "Grading",
    category: "hatchery",
    definition:
      "Sorting a population by size. Grading reduces size dispersal and cannibalism during rearing, and at harvest produces the uniform weight bands that buyers order against.",
    seeAlso: ["size-band", "fingerling"],
  },
  {
    slug: "metamorphosis",
    term: "Metamorphosis",
    category: "hatchery",
    definition:
      "The transformation from larval to juvenile form — in flatfish, the migration of one eye across the head and the shift to a bottom-dwelling life. It marks the end of dependence on live feed.",
    seeAlso: ["larval-rearing", "weaning"],
  },

  // ----------------------------------------------------------------- salmonid
  {
    slug: "eyed-ova",
    term: "Eyed Ova",
    category: "salmonid",
    definition:
      "Fertilised eggs incubated to the point where the embryo's pigmented eyes are visible through the shell. At this stage the egg tolerates handling and shock, which is what makes international shipment of ova possible at all.",
    seeAlso: ["green-eggs", "degree-days", "spf"],
    guide: "/salmonid-ova-solutions",
  },
  {
    slug: "green-eggs",
    term: "Green Eggs",
    category: "salmonid",
    definition:
      "Newly fertilised eggs before the eyed stage. They are extremely sensitive to mechanical shock and are not shipped — ova are held in the originating hatchery until they eye up.",
    seeAlso: ["eyed-ova", "degree-days"],
  },
  {
    slug: "degree-days",
    term: "Degree-Days",
    abbr: "thermal units",
    category: "salmonid",
    definition:
      "Accumulated temperature multiplied by time, used to predict embryonic development. Ova suppliers quote development in degree-days rather than calendar days because the same figure holds across incubation temperatures, letting a buyer plan a delivery date around their own water.",
    seeAlso: ["eyed-ova", "green-eggs"],
    guide: "/salmonid-ova-solutions",
  },
  {
    slug: "ploidy",
    term: "Ploidy",
    category: "salmonid",
    definition:
      "The number of chromosome sets carried in a cell. Farmed salmonids are either diploid, with two sets, or triploid, with three.",
    seeAlso: ["triploid", "all-female"],
  },
  {
    slug: "triploid",
    term: "Triploid",
    category: "salmonid",
    definition:
      "Stock carrying three chromosome sets, produced by treating newly fertilised eggs so a polar body is retained. Triploids are functionally sterile, so they do not divert energy into gonad development and cannot interbreed with wild populations — the reason regulators in several markets favour them.",
    seeAlso: ["ploidy", "all-female"],
    guide: "/salmonid-ova-solutions",
  },
  {
    slug: "all-female",
    term: "All-Female Stock",
    category: "salmonid",
    definition:
      "Batches produced so that effectively all offspring are female. In trout and salmon this avoids the early male maturation that degrades flesh quality and growth before the fish reaches market size.",
    seeAlso: ["triploid", "ploidy"],
  },
  {
    slug: "smoltification",
    term: "Smoltification",
    category: "salmonid",
    definition:
      "The physiological transformation that prepares a juvenile salmon for seawater, involving changes to gill function, body silvering and behaviour. Transferring fish before or after the window costs survival.",
    seeAlso: ["photoperiod", "ras"],
  },

  // ------------------------------------------------------------------- health
  {
    slug: "biosecurity",
    term: "Biosecurity",
    category: "health",
    definition:
      "The set of procedures that keep pathogens out of a facility and stop them spreading inside it — disinfection, quarantine, controlled stock and staff movement, and routine screening. It is a system, not a certificate.",
    seeAlso: ["quarantine", "spf", "traceability"],
  },
  {
    slug: "spf",
    term: "SPF",
    abbr: "Specific Pathogen Free",
    category: "health",
    definition:
      "Stock certified free of a defined list of pathogens under a documented, repeated surveillance programme. SPF is a statement about a testing regime and a named list — it does not mean the animals are resistant to those pathogens, or free of everything else.",
    seeAlso: ["biosecurity", "health-certificate", "ipn"],
    guide: "/salmonid-ova-solutions",
  },
  {
    slug: "ipn",
    term: "IPN",
    abbr: "Infectious Pancreatic Necrosis",
    category: "health",
    definition:
      "A viral disease of salmonids, most damaging in fry and in fish shortly after seawater transfer. It is one of the pathogens commonly named on salmonid ova health certificates.",
    seeAlso: ["spf", "health-certificate", "bkd"],
  },
  {
    slug: "bkd",
    term: "BKD",
    abbr: "Bacterial Kidney Disease",
    category: "health",
    definition:
      "A chronic bacterial disease of salmonids caused by Renibacterium salmoninarum. It can pass from broodstock into the egg, which is why control depends on screening the broodstock rather than treating the offspring.",
    seeAlso: ["broodstock", "spf", "ipn"],
  },
  {
    slug: "isa",
    term: "ISA",
    abbr: "Infectious Salmon Anaemia",
    category: "health",
    definition:
      "A notifiable viral disease of Atlantic salmon. Because it is notifiable, a confirmed case triggers official control measures and trade restrictions on movements from the affected zone.",
    seeAlso: ["health-certificate", "spf"],
  },
  {
    slug: "quarantine",
    term: "Quarantine",
    category: "health",
    definition:
      "Holding incoming stock isolated and under observation before it joins the main population, so that anything introduced with it is detected while still contained.",
    seeAlso: ["biosecurity"],
  },
  {
    slug: "health-certificate",
    term: "Health Certificate",
    category: "health",
    definition:
      "The official veterinary document certifying that a consignment meets the animal-health conditions of the importing country. It is issued by the competent authority of the exporting country, not by the seller.",
    seeAlso: ["traces", "bip", "spf"],
  },
  {
    slug: "traces",
    term: "TRACES",
    category: "health",
    definition:
      "The European Commission's online system for certifying and tracking consignments of animals and animal products entering or moving within the EU. Certificates are raised and followed electronically rather than on paper alone.",
    seeAlso: ["health-certificate", "bip"],
  },
  {
    slug: "bip",
    term: "Border Control Post",
    abbr: "BCP, formerly BIP",
    category: "health",
    definition:
      "The designated EU entry point where consignments of animal origin undergo documentary, identity and physical checks before release. Consignments must be pre-notified and arrive at a post approved for that product category.",
    seeAlso: ["traces", "health-certificate"],
  },
  {
    slug: "haccp",
    term: "HACCP",
    abbr: "Hazard Analysis and Critical Control Points",
    category: "health",
    definition:
      "A food-safety management approach that identifies the hazards in a process, fixes the points where each can be controlled, and sets limits and monitoring at those points. Required for seafood placed on most regulated markets.",
    seeAlso: ["traceability", "cold-chain"],
  },
  {
    slug: "traceability",
    term: "Traceability",
    category: "health",
    definition:
      "The ability to follow a batch in both directions — from raw input to finished consignment, and back from a delivered unit to its production record. It is what makes a targeted recall possible instead of a total one.",
    seeAlso: ["lot-number", "haccp"],
  },
  {
    slug: "lot-number",
    term: "Lot / Batch Number",
    category: "health",
    definition:
      "The identifier that ties a shipped unit to its production and testing records. Without it, traceability and certification are claims rather than something a buyer or an inspector can check.",
    seeAlso: ["traceability", "data-logger"],
  },

  // --------------------------------------------------------------------- feed
  {
    slug: "aquafeed",
    term: "Aquafeed",
    category: "feed",
    definition:
      "Compounded feed formulated for aquatic species, balancing protein, lipid and micronutrients against the digestive physiology of the target animal and its life stage.",
    seeAlso: ["fcr", "micro-feed", "proximate-analysis"],
  },
  {
    slug: "fcr",
    term: "FCR",
    abbr: "Feed Conversion Ratio",
    category: "feed",
    definition:
      "Weight of feed given divided by weight gained. A lower figure means more of the feed became fish. As feed is usually the largest single cost in grow-out, FCR is the number farm economics turn on.",
    seeAlso: ["aquafeed", "palatability"],
  },
  {
    slug: "proximate-analysis",
    term: "Proximate Analysis",
    category: "feed",
    definition:
      "The standard laboratory breakdown of a feed or ingredient into moisture, crude protein, crude fat, ash and fibre. It describes composition, not digestibility — two ingredients with identical proximate figures can perform quite differently.",
    seeAlso: ["crude-protein", "crude-fat", "ash"],
  },
  {
    slug: "crude-protein",
    term: "Crude Protein",
    category: "feed",
    definition:
      "Protein content estimated by measuring total nitrogen and multiplying by a conversion factor. Because it infers protein from nitrogen, it says nothing about amino acid balance or how much of that protein the animal can actually use.",
    seeAlso: ["proximate-analysis", "fish-meal"],
  },
  {
    slug: "crude-fat",
    term: "Crude Fat",
    abbr: "crude lipid",
    category: "feed",
    definition:
      "Total lipid recovered by solvent extraction in proximate analysis. The figure covers all lipid classes together, so it does not reveal the essential fatty acid content that matters most to larvae.",
    seeAlso: ["proximate-analysis", "hufa"],
  },
  {
    slug: "ash",
    term: "Ash",
    category: "feed",
    definition:
      "The inorganic mineral residue left after a sample is combusted. In fish meal a rising ash figure usually signals a higher proportion of bone relative to muscle.",
    seeAlso: ["proximate-analysis", "fish-meal"],
  },
  {
    slug: "hufa",
    term: "HUFA",
    abbr: "Highly Unsaturated Fatty Acids",
    category: "feed",
    definition:
      "Long-chain fatty acids, principally EPA, DHA and ARA. Marine fish larvae cannot synthesise them in sufficient quantity and must receive them in the diet, which is the entire purpose of enriching live feed.",
    seeAlso: ["epa", "dha", "ara", "enrichment"],
  },
  {
    slug: "epa",
    term: "EPA",
    abbr: "Eicosapentaenoic Acid, C20:5 n-3",
    category: "feed",
    definition:
      "An omega-3 long-chain fatty acid essential to marine larvae and a major component of fish oil. Usually specified alongside DHA, since the ratio between them matters as much as either absolute figure.",
    seeAlso: ["dha", "hufa", "fish-oil"],
  },
  {
    slug: "dha",
    term: "DHA",
    abbr: "Docosahexaenoic Acid, C22:6 n-3",
    category: "feed",
    definition:
      "An omega-3 long-chain fatty acid concentrated in neural and retinal tissue, and therefore closely tied to larval vision, feeding success and survival. The DHA:EPA ratio is a standard specification for enrichment products.",
    seeAlso: ["epa", "hufa", "enrichment"],
  },
  {
    slug: "ara",
    term: "ARA",
    abbr: "Arachidonic Acid, C20:4 n-6",
    category: "feed",
    definition:
      "An omega-6 long-chain fatty acid involved in stress response and, in flatfish, in normal pigmentation. It is required in far smaller amounts than EPA and DHA, and its balance against them is what counts.",
    seeAlso: ["hufa", "epa", "dha"],
  },
  {
    slug: "fish-meal",
    term: "Fish Meal",
    category: "feed",
    definition:
      "A dried, ground protein meal produced from whole fish or from processing trimmings. It remains the reference protein source in aquafeed because of its amino acid profile and palatability.",
    seeAlso: ["crude-protein", "ash", "fish-oil"],
    product: { category: "feed-additives", slug: "fish-meal" },
  },
  {
    slug: "fish-oil",
    term: "Fish Oil",
    category: "feed",
    definition:
      "The lipid fraction rendered from fish during meal production, and the principal dietary source of EPA and DHA in aquafeed.",
    seeAlso: ["epa", "dha", "fish-meal"],
  },
  {
    slug: "vital-wheat-gluten",
    term: "Vital Wheat Gluten",
    category: "feed",
    definition:
      "The elastic protein fraction of wheat, used in aquafeed both as a digestible protein source and as a binder that holds extruded pellets together in water.",
    seeAlso: ["binder", "crude-protein"],
    product: { category: "feed-additives", slug: "vital-wheat-gluten" },
  },
  {
    slug: "binder",
    term: "Binder",
    category: "feed",
    definition:
      "An ingredient that holds a pellet together so it survives handling and immersion. Poor binding loses fines to the water, which is both wasted feed and an added waste load.",
    seeAlso: ["vital-wheat-gluten", "aquafeed"],
  },
  {
    slug: "micro-feed",
    term: "Micro-Feed",
    abbr: "microdiet",
    category: "feed",
    definition:
      "Formulated feed milled and sized to particles a larval fish can physically ingest. Micro-feeds are what larvae are weaned onto, usually alongside live feed before it is withdrawn.",
    seeAlso: ["weaning", "co-feeding"],
  },
  {
    slug: "moist-pellet",
    term: "Moist Pellet",
    category: "feed",
    definition:
      "Feed produced and fed at a higher moisture content than dry extruded pellets. The texture and moisture improve acceptance, particularly with species or life stages that take dry feed reluctantly.",
    seeAlso: ["palatability", "aquafeed"],
  },
  {
    slug: "palatability",
    term: "Palatability",
    category: "feed",
    definition:
      "How readily an animal accepts and keeps eating a feed. A nutritionally complete diet that is refused, or eaten slowly, converts worse than a simpler one that is taken immediately.",
    seeAlso: ["attractant", "fcr"],
  },
  {
    slug: "attractant",
    term: "Attractant",
    category: "feed",
    definition:
      "An ingredient included to stimulate the feeding response — locating the pellet, then ingesting it. Particularly relevant where fish meal inclusion has been reduced in favour of plant proteins.",
    seeAlso: ["palatability", "fish-meal"],
  },

  // ------------------------------------------------------------------- export
  {
    slug: "cold-chain",
    term: "Cold Chain",
    category: "export",
    definition:
      "Unbroken temperature-controlled handling from harvest through to delivery. Its integrity is a property of the weakest link, which is why loading and transfer points matter more than transit itself.",
    seeAlso: ["reefer", "flake-ice", "data-logger"],
    guide: "/seafood-export",
  },
  {
    slug: "reefer",
    term: "Reefer",
    category: "export",
    definition:
      "A refrigerated shipping container or truck with its own temperature control unit, carrying chilled or frozen cargo at a set point for the whole journey.",
    seeAlso: ["cold-chain", "data-logger"],
  },
  {
    slug: "data-logger",
    term: "Temperature Data Logger",
    category: "export",
    definition:
      "A recorder travelling inside the consignment that logs temperature at intervals throughout transit. It converts a cold-chain claim into a record the receiver can inspect on arrival.",
    seeAlso: ["cold-chain", "lot-number"],
  },
  {
    slug: "flake-ice",
    term: "Flake Ice",
    category: "export",
    definition:
      "Thin, soft ice used to pack fresh fish. Its shape gives close contact without bruising the flesh, and it melts evenly to keep the fish at temperature.",
    seeAlso: ["cold-chain", "whole-round"],
  },
  {
    slug: "iqf",
    term: "IQF",
    abbr: "Individually Quick Frozen",
    category: "export",
    definition:
      "Freezing each piece separately and at speed, so pieces stay loose rather than freezing into a block and the buyer can portion out only what is needed.",
    seeAlso: ["cold-chain", "fillet"],
  },
  {
    slug: "whole-round",
    term: "Whole Round",
    category: "export",
    definition:
      "Fish shipped exactly as landed, ungutted and with head on. The most common form for fresh export where the buyer processes on arrival.",
    seeAlso: ["dg", "dressed", "fillet"],
  },
  {
    slug: "dg",
    term: "D&G",
    abbr: "Drawn & Gutted",
    category: "export",
    definition:
      "Fish with the viscera and gills removed but the head retained. Gutting at source extends shelf life, since the digestive tract is where spoilage starts.",
    seeAlso: ["whole-round", "dressed"],
  },
  {
    slug: "dressed",
    term: "Dressed",
    category: "export",
    definition:
      "Fish gutted with the head removed. Lowers shipped weight and freight cost per usable kilo compared with whole round.",
    seeAlso: ["dg", "fillet"],
  },
  {
    slug: "fillet",
    term: "Fillet",
    category: "export",
    definition:
      "The boneless side of a fish, cut parallel to the backbone, supplied skin-on or skin-off. Yield per whole fish varies by species and by the size grade it was cut from.",
    seeAlso: ["dressed", "size-band", "iqf"],
  },
  {
    slug: "size-band",
    term: "Size Band",
    abbr: "grade",
    category: "export",
    definition:
      "The weight range a batch is sorted and sold against — for example 300–400 g or 400–600 g. Buyers order by band because portion size determines how the fish can be used at the far end.",
    seeAlso: ["grading", "fillet"],
  },
  {
    slug: "horeca",
    term: "HORECA",
    abbr: "Hotel, Restaurant, Catering",
    category: "export",
    definition:
      "The foodservice channel, as distinct from retail. HORECA buyers order to portion specification and consistency rather than to retail pack format, and expect delivery reliability over headline price.",
    seeAlso: ["size-band", "cold-chain"],
    guide: "/horeca-seafood-middle-east",
  },
  {
    slug: "certificate-of-origin",
    term: "Certificate of Origin",
    category: "export",
    definition:
      "A document attesting the country in which the goods were produced. It determines the tariff treatment a consignment receives and is required for preferential trade arrangements.",
    seeAlso: ["hs-code", "health-certificate"],
  },
  {
    slug: "hs-code",
    term: "HS Code",
    abbr: "Harmonized System",
    category: "export",
    definition:
      "The internationally standardised commodity classification number for a product. It sets the duty rate and determines which import controls and certificates apply, so an incorrect code delays clearance.",
    seeAlso: ["certificate-of-origin", "bip"],
  },
  {
    slug: "proforma-invoice",
    term: "Proforma Invoice",
    category: "export",
    definition:
      "A preliminary invoice issued before shipment setting out specification, quantity, price and delivery terms. Buyers use it to arrange payment, open a letter of credit or apply for an import permit.",
    seeAlso: ["moq", "hs-code"],
  },
  {
    slug: "moq",
    term: "MOQ",
    abbr: "Minimum Order Quantity",
    category: "export",
    definition:
      "The smallest quantity a supplier will produce or ship for a given item. It generally reflects a production batch size or a full pallet, container or air-freight unit rather than an arbitrary threshold.",
    seeAlso: ["proforma-invoice"],
  },
];

/** Terms for one category, alphabetised — the order they render in. */
export const getGlossaryByCategory = (key: GlossaryCategoryKey): GlossaryTerm[] =>
  GLOSSARY.filter((g) => g.category === key).sort((a, b) => a.term.localeCompare(b.term));

export const getGlossaryTerm = (slug: string): GlossaryTerm | undefined =>
  GLOSSARY.find((g) => g.slug === slug);
