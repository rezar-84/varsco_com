import type { Product, ProductCategory } from "../types";
import { odooAssetUrl, odooDirectUrl } from "../odoo-asset";

// Product image assets (Locally hosted authentic VARS photography & 3D packaging)
import reviveDecapImg from "@/assets/products/revive-artemia-decap.png";
import reviveDecapOpenImg from "@/assets/products/revive-artemia-decap-open.jpg";

import reviveCysts2kgImg from "@/assets/products/revive-artemia-cysts-2kg.png";
import reviveCystsOpenImg from "@/assets/products/revive-artemia-cysts-open.jpg";

import sv12ProductImg from "@/assets/products/super-fresh-chlorella-sv12.png";
import sv12HighResImg from "@/assets/products/sv12-high-res.jpg";

import emeraldChlorellaImg from "@/assets/products/emerald-chlorella-powder.png";
import emeraldChlorellaOpenedImg from "@/assets/products/emerald-chlorella-opened.png";

import salmonEggsScaleImg from "@/assets/products/atlantic-salmon-eggs-scale.jpg";
import salmonEggsThermoImg from "@/assets/products/salmon-eggs-thermo.jpg";
import salmonTraysImg from "@/assets/products/salmon-incubation-trays.jpg";

import fishMealImg from "@/assets/products/premium-fish-meal.png";
import wheatGlutenImg from "@/assets/products/wheat-gluten-container.jpg";

import seaBassImgFile from "@/assets/products/mediterranean-seabass.png";
import seaBreamImgFile from "@/assets/products/mediterranean-seabream.png";
import oliveFlounderImg from "@/assets/products/korean-olive-flounder.jpg";
import amberjackImg from "@/assets/products/greater-amberjack.jpg";
import shrimpImg from "@/assets/products/shrimp.jpg";
import shrimpFrozenBoxImg from "@/assets/products/shrimp-frozen-box-01.jpg";
import shrimpFrozenBlockImg from "@/assets/products/shrimp-frozen-block-02.jpg";
import shrimpFrozenCartonsImg from "@/assets/products/shrimp-frozen-cartons-03.jpg";
import oysterImg from "@/assets/products/oyster.webp";

const reviveDecap = { url: reviveDecapImg, gallery: [reviveDecapOpenImg] };
const reviveCysts = { url: reviveCysts2kgImg, gallery: [reviveCystsOpenImg] };
const sv12 = { url: sv12ProductImg, gallery: [sv12HighResImg] };
const emeraldChlorella = { url: emeraldChlorellaImg, gallery: [emeraldChlorellaOpenedImg] };

// Salmon eggs requested default image URL
const salmonEggs = {
  url: odooAssetUrl(
    "/web/image/product.image/8/image_1920/Blog%20Post%20%27Fertilized%20Salmon%20Eggs_%20Where%20Every%20Salmon%20Farming%20Journey%20Begins%27%20cover%20image.webp?unique=ea15b07",
  ),
  gallery: [salmonEggsScaleImg, salmonEggsThermoImg, salmonTraysImg],
};

// Feed Additives requested default image URLs
const fishMeal = {
  url: odooAssetUrl("/web/image/product.product/63/image_1024/Fish%20Meal?unique=23330ef"),
  gallery: [fishMealImg],
};

const wheatGluten = {
  url: odooAssetUrl(
    "/web/image/product.product/47/image_1024/Vital%20Wheat%20Gluten?unique=563ed38",
  ),
  gallery: [wheatGlutenImg],
};

// Seafood requested default image URLs from varsco.com/products/seafood
const seaBassImg = {
  url: odooAssetUrl("/web/image/9727-c596f7d9/levrek4_edited.webp"),
  gallery: [seaBassImgFile],
};

const seaBream = {
  url: odooAssetUrl(
    "/web/image/8924-1adb113f/customized_-c3-87-c3-bcpura_edited_e2c17a7c-48c8-4d84-b89a-0a1e054ae7ed.webp",
  ),
  gallery: [seaBreamImgFile],
};

const oliveFlounder = {
  url: odooAssetUrl("/web/image/9726-522f2377/olive-flounder.webp"),
  gallery: [oliveFlounderImg],
};

const brownMeagre = {
  url: odooAssetUrl(
    "/web/image/8933-f0ca00b6/customized_d678439dec7544b2a9dca505d6cf86fb_brown_meagre_edited_72d89622-98a2-4f05-8dbd-6ba6dea548f9.webp",
  ),
};

const amberjack = {
  url: odooAssetUrl(
    "/web/image/8934-e1f13b3d/customized_d609f1c9314a409bb53bb323d57a9f54_amberjack_3c6a5d1b-0622-4a86-acbf-d70dc78ddd23.webp",
  ),
  gallery: [amberjackImg],
};

const rainbowTrout = {
  url: odooAssetUrl(
    "/web/image/8925-5db3df07/customized_alabal_edited_cd262b88-b15a-427c-a7b5-03f89c23bd6c.webp",
  ),
};

const shrimp = {
  url: shrimpImg,
  gallery: [shrimpFrozenBoxImg, shrimpFrozenBlockImg, shrimpFrozenCartonsImg],
};

const oyster = { url: oysterImg };

export const CATEGORIES: ProductCategory[] = [
  {
    slug: "feed-additives",
    title: "Additives & Raw Materials",
    description:
      "High-protein feed ingredients and raw materials — fish meal, vital wheat gluten and potato protein — engineered for aquaculture growth, digestibility and pellet stability.",
    image: fishMeal.url,
  },
  {
    slug: "hatchery-solutions",
    title: "Hatchery Solutions & Inputs",
    description:
      "Certified fertilized Atlantic and Coho salmon eggs from a diversified network of international breeding programmes, plus essential hatchery feed inputs like decapsulated Artemia.",
    image: salmonEggs.url,
  },
  {
    slug: "live-feed-aquaculture",
    title: "Live Feed for Aquaculture",
    description:
      "Artemia cysts and Chlorella microalgae — the foundation of every larval rearing programme.",
    image: reviveCysts.url,
  },
  {
    slug: "seafood",
    title: "Seafood Export",
    description:
      "Premium Mediterranean and farmed seafood — sea bass, sea bream, amberjack, trout, flounder and more — shipped fresh from Turkey to global markets.",
    image: seaBream.url,
  },
];

export const PRODUCTS: Product[] = [
  // ────────────────── Feed Additives ──────────────────
  {
    slug: "fish-meal",
    category: "feed-additives",
    title: "Fish Meal",
    tagline:
      "High-protein, highly digestible marine ingredient essential for optimal growth, health and feed efficiency.",
    tags: ["Protein 55–65%", "Sustainably sourced", "Bulk & 25 kg"],
    description:
      "A key ingredient in aquaculture feed production. At VARS Aquaculture, our fish meal is produced from sustainably sourced whole fish and trimmings, ensuring consistent quality, strong nutritional value and reliable supply.",
    longDescription: [
      "Fish Meal is one of the most important protein sources in modern aquafeed. It delivers a full amino-acid profile, essential fatty acids and highly digestible minerals for salmonids, sea bream, sea bass and shrimp diets.",
      "VARS fish meal is produced under strict quality control from wild-caught pelagic species and trimmings, offering consistent batch-to-batch performance for feed formulators worldwide.",
    ],
    highlights: [
      "Sustainably sourced whole fish & trimmings",
      "Consistent nutritional profile batch-to-batch",
      "Global shipping via air and sea freight",
      "Flexible Incoterms (EXW, FOB, CIF)",
    ],
    metrics: [
      { label: "Moisture", value: "≤ 10%" },
      { label: "Protein", value: "55–65%" },
      { label: "Lipids (Fat)", value: "8–12%" },
      { label: "Ash (Minerals)", value: "10–20%" },
    ],
    specifications: [
      { label: "Product Type", value: "Steam-dried fish meal" },
      { label: "Packaging", value: "25 kg bags · Big bags · Bulk supply" },
      { label: "Storage", value: "Cool, dry, ventilated; protect from moisture & sunlight" },
      { label: "Delivery", value: "Global air & sea freight · palletized or bulk" },
      { label: "Incoterms", value: "EXW · FOB · CIF" },
    ],
    applications: [
      "Salmonid grow-out feeds",
      "Sea bream & sea bass diets",
      "Shrimp and prawn nutrition",
      "Fry starter and broodstock formulations",
    ],
    storage:
      "Store in cool, dry and ventilated conditions. Protect from moisture and direct sunlight. Keep in sealed packaging.",
    image: fishMeal.url,
    seoKeywords: [
      "fish meal wholesale",
      "aquafeed fish meal",
      "steam dried fish meal",
      "fish protein powder",
      "digestible marine protein",
      "shrimp feed fish meal",
    ],
    searchSynonyms: [
      "fishmeal",
      "fish powder",
      "marine protein",
      "pelagic fish meal",
      "anchovy meal",
      "aquafeed protein",
    ],
    relatedProducts: ["vital-wheat-gluten", "potato-protein-meal"],
  },
  {
    slug: "vital-wheat-gluten",
    category: "feed-additives",
    title: "Vital Wheat Gluten",
    tagline:
      "High-performance plant-based protein for aquafeed — exceptional binding, digestibility and pellet stability.",
    tags: ["Protein ≥ 82%", "Water absorption ≥ 150%", "EU / Canada origin"],
    description:
      "Vital Wheat Gluten is a high-performance plant protein designed for aquaculture feed formulations. It delivers exceptional binding properties, high digestibility and consistent pellet quality across hatchery, grow-out and broodstock feeds.",
    longDescription: [
      "At VARS Aquaculture, our wheat gluten is sourced from premium European and Canadian producers and processed to ensure high protein concentration and superior functional performance in extruded aquafeed.",
    ],
    highlights: [
      "Protein content ≥ 82% (dry basis)",
      "Excellent binding and pellet stability",
      "High water absorption capacity ≥ 150%",
      "Improves feed efficiency and digestibility",
      "Suitable for hatchery, grow-out and broodstock feeds",
    ],
    metrics: [
      { label: "Water Absorption", value: "150%" },
      { label: "Protein", value: "~82%" },
      { label: "Moisture", value: "10%" },
      { label: "Calcium", value: "250 mg" },
    ],
    specifications: [
      { label: "Product Type", value: "Vital Wheat Gluten" },
      { label: "Origin", value: "EU / Canada (depending on batch)" },
      { label: "Protein (dry basis)", value: "≥ 82%" },
      { label: "Moisture", value: "≤ 10%" },
      { label: "Ash", value: "≤ 2.0%" },
      { label: "Water Absorption", value: "≥ 150%" },
    ],
    applications: [
      "Extruded pellet binder",
      "Salmonid and marine finfish diets",
      "Shrimp feed formulations",
      "Broodstock and hatchery feeds",
    ],
    storage:
      "Store in a cool, dry warehouse in sealed packaging. Shelf life 18 months under recommended conditions.",
    image: wheatGluten.url,
    seoKeywords: [
      "vital wheat gluten",
      "wheat gluten 82%",
      "aquafeed binder",
      "extruded feed protein",
      "high protein wheat gluten",
      "water stability binder",
    ],
    searchSynonyms: [
      "wheat gluten",
      "gluten 82",
      "pellet binder",
      "aquafeed protein",
      "plant protein binder",
      "gluten powder",
    ],
    relatedProducts: ["potato-protein-meal", "fish-meal"],
  },
  {
    slug: "potato-protein-meal",
    category: "feed-additives",
    title: "Potato Protein Meal",
    tagline:
      "Concentrated plant protein meal for seabass, seabream and salmonids — high digestibility, low anti-nutritional factors.",
    tags: ["Protein ≥ 76%", "Digestibility 92%", "EU Origin"],
    description:
      "Potato Protein Meal is a premium, highly concentrated plant protein ingredient specifically formulated for marine aquaculture feeds. It offers superior amino acid balance, high digestibility and low anti-nutritional factors, making it an ideal alternative to fish meal in seabass and seabream diets.",
    longDescription: [
      "Potato Protein Meal is manufactured from non-GMO European potatoes through precise extraction and drying processes that preserve amino acid integrity.",
      "Extensive trial data demonstrates that replacing up to 20% of fish meal with Potato Protein Meal maintains optimal growth rates and feed conversion ratios (FCR) while reducing diet costs.",
    ],
    highlights: [
      "Crude Protein ≥ 76% (dry basis)",
      "High digestibility coefficient ≥ 92%",
      "Rich in essential amino acids (Lysine & Methionine)",
      "Non-GMO European origin",
      "Reduces dependency on fish meal in marine diets",
    ],
    metrics: [
      { label: "Protein", value: "≥ 76%" },
      { label: "Digestibility", value: "92%" },
      { label: "Moisture", value: "≤ 8%" },
      { label: "Fat", value: "≤ 2%" },
    ],
    specifications: [
      { label: "Product Type", value: "Concentrated Potato Protein Powder" },
      { label: "Origin", value: "European Union" },
      { label: "Packaging", value: "25 kg bags · 1000 kg big bags" },
      { label: "Shelf Life", value: "24 months in dry conditions" },
    ],
    applications: [
      "Seabass & Seabream grow-out diets",
      "Salmonid feeds",
      "Shrimp larval & juvenile feeds",
    ],
    storage: "Store in cool, dry ventilated warehouse. Protect from moisture and direct sunlight.",
    image: fishMeal.url,
    seoKeywords: [
      "potato protein meal",
      "potato protein powder",
      "plant protein aquafeed",
      "fish meal replacer",
      "high digestibility potato protein",
    ],
    searchSynonyms: [
      "potato protein",
      "potato feed powder",
      "concentrated potato protein",
      "non gmo plant protein",
    ],
  },
  // ────────────────── Hatchery Solutions ──────────────────
  {
    slug: "atlantic-salmon-egg",
    category: "hatchery-solutions",
    title: "Atlantic Fertilized Salmon Eggs",
    latinName: "Salmo salar",
    tagline:
      "High-quality fertilized Atlantic salmon eggs sourced from a diversified network of trusted international hatcheries.",
    tags: ["Disease-free broodstock", "Diploid & Triploid", "Cold-chain air freight"],
    description:
      "At VARS Aquaculture we supply high-quality fertilized Atlantic Salmon (Salmo salar) eggs sourced from a diversified network of trusted international hatcheries. Our multi-origin model ensures continuous availability, stable pricing and fast, temperature-controlled air shipment to your destination.",
    longDescription: [
      "Build a reliable salmon production cycle with carefully selected fertilized eggs produced under strict hatchery and biosecurity standards.",
      "Start your Atlantic salmon lifecycle with consistency and confidence. Our eggs are sourced from certified, disease-free broodstock maintained under stringent biosecurity protocols.",
    ],
    highlights: [
      "Diploid Atlantic Salmon Eggs",
      "Triploid Atlantic Salmon Eggs",
      "Commercial salmon hatcheries",
      "Land-based aquaculture and RAS systems",
      "Freshwater and seawater production",
      "Research and breeding facilities",
    ],
    metrics: [
      { label: "Hatching Rate", value: "≥ 95%" },
      { label: "Broodstock", value: "SPF certified" },
      { label: "Ploidy", value: "Diploid / Triploid" },
      { label: "Delivery", value: "4 °C air" },
    ],
    specifications: [
      { label: "Species", value: "Atlantic Salmon (Salmo salar)" },
      { label: "Broodstock Health", value: "Certified disease-free, SPF" },
      { label: "Origins", value: "Diversified international hatchery network" },
      { label: "Shipping", value: "Insulated boxes, temperature-controlled air freight" },
      { label: "Delivery Temp.", value: "4–8 °C until transfer to incubation" },
    ],
    seoKeywords: [
      "salmon eyed eggs",
      "salmon ova",
      "fertilized Atlantic salmon eggs",
      "SPF salmon ova",
      "Salmo salar ova",
      "triploid salmon eggs",
      "all female salmon eggs",
      "eyed salmon ova",
      "coldwater incubation ova",
    ],
    searchSynonyms: [
      "eyed eggs",
      "salmon eggs",
      "salmon ova",
      "fertilized eggs",
      "eyed ova",
      "salmon fingerling eggs",
      "salmon hatchery ova",
    ],
    applications: [
      "Commercial salmon hatcheries",
      "Land-based RAS start-ups",
      "Freshwater and seawater grow-out",
      "Research and breeding facilities",
    ],
    storage:
      "Maintain 4–8 °C until transfer to incubation trays. Handle with strict biosecurity protocols.",
    image: salmonEggs.url,
    gallery: salmonEggs.gallery,
  },
  {
    slug: "coho-salmon-egg",
    category: "hatchery-solutions",
    title: "Coho Fertilized Salmon Eggs",
    latinName: "Oncorhynchus kisutch",
    tagline:
      "SPF certified Coho salmon ova for cold-water hatcheries and RAS farms — rapid early growth and high survival rates.",
    tags: ["SPF Certified", "Rapid Growth", "Temperature Controlled"],
    description:
      "Fertilized Coho Salmon (Oncorhynchus kisutch) eggs sourced from certified pathogen-free broodstock. Renowned for fast early development, high disease resistance, and excellent performance in freshwater RAS and sea-cage grow-out operations.",
    highlights: [
      "Certified Specific Pathogen Free (SPF) status",
      "High hatching rate ≥ 95%",
      "Fast early fry development and feeding response",
      "Supplied in temperature-monitored air freight containers",
    ],
    metrics: [
      { label: "Hatching Rate", value: "≥ 95%" },
      { label: "Broodstock", value: "SPF Certified" },
      { label: "Ploidy", value: "Diploid" },
      { label: "Delivery Temp.", value: "4 °C" },
    ],
    specifications: [
      { label: "Species", value: "Coho Salmon (Oncorhynchus kisutch)" },
      { label: "Health Status", value: "SPF - Free of IPNV, VHSV, IHNV" },
      { label: "Shipping", value: "Temperature-logged insulated shipping boxes" },
    ],
    applications: ["RAS salmon farms", "Cold-water hatcheries", "Commercial salmon production"],
    storage: "Unpack upon arrival into 4-6 °C incubation water following biosecurity protocol.",
    image: salmonEggs.url,
    gallery: salmonEggs.gallery,
    seoKeywords: [
      "Coho salmon eggs",
      "Oncorhynchus kisutch ova",
      "silver salmon eggs",
      "fertilized Coho ova",
      "eyed Coho salmon eggs",
      "RAS salmon ova",
    ],
    searchSynonyms: [
      "coho ova",
      "silver salmon ova",
      "eyed coho eggs",
      "pacific salmon eggs",
      "coho eggs",
    ],
  },
  {
    slug: "decapsulated-dry-artemia-cysts",
    category: "hatchery-solutions",
    title: "Decapsulated Dry Artemia Cysts",
    tagline:
      "Premium shell-free nutrition — 0% shell contamination, laboratory-grade biosecurity for hatcheries, aquaculture and home aquariums.",
    tags: ["Shell-free", "Ready to feed", "Protein 61%", "Aquarium & Reef Safe"],
    description:
      "Decapsulated Dry Artemia Cysts provide premium shell-free nutrition with laboratory-grade biosecurity and 0% shell contamination. Feed directly to larvae, fry, shrimp post-larvae, broodstock and ornamental species — no shell separation, no hatching required. Just as popular with reef aquarists and fish breeders as it is with commercial hatcheries.",
    longDescription: [
      "Processed under controlled conditions with 0% shell content, 0% light impurities, 0% heavy impurities and moisture controlled at 4–5%.",
      "High protein and energy value supports rapid larval growth and strong survival performance. Reduces risks associated with bacterial contamination and unhatched cyst accumulation in larval systems.",
    ],
    highlights: [
      "Shell-free & ready to use — no hatching required",
      "0% shell content · 0% impurities",
      "Moisture controlled at 4–5%",
      "Improved biosecurity in larval systems",
      "Operational efficiency: no incubation cones needed",
    ],
    metrics: [
      { label: "Protein", value: "~61%" },
      { label: "Fat", value: "~24.5%" },
      { label: "Energy", value: "502 kcal / 100 g" },
      { label: "Moisture", value: "4–5%" },
    ],
    specifications: [
      { label: "Form", value: "Dry decapsulated cysts" },
      { label: "Shell content", value: "0%" },
      { label: "Impurities", value: "0% light · 0% heavy" },
      { label: "Packaging", value: "500 g / 1 kg / 2 kg cans" },
    ],
    applications: [
      "Fish larvae and fry",
      "Shrimp post-larvae",
      "Broodstock conditioning",
      "Ornamental species",
      "Home aquariums & reef tanks",
      "Pet shops & fish breeders",
    ],
    storage: "Store in a cool, dry place. Reseal cans after use to preserve moisture control.",
    image: reviveDecap.url,
    gallery: reviveDecap.gallery,
    relatedProducts: ["artemia", "emerald-chlorella-powder", "super-fresh-chlorella-v12"],
    seoKeywords: [
      "decapsulated Artemia",
      "shell free Artemia",
      "decap Artemia cysts",
      "direct feed Artemia",
      "non hatching Artemia",
      "de-shelled brine shrimp",
      "aquarium decapsulated artemia",
      "reef tank fish food",
      "home aquarium live feed",
    ],
    searchSynonyms: [
      "decap artemia",
      "shell-less artemia",
      "dry decap",
      "non-hatching artemia",
      "shell free brine shrimp",
      "aquarium artemia",
      "reef aquarium food",
    ],
  },

  // ────────────────── Live Feed ──────────────────
  {
    slug: "artemia",
    category: "live-feed-aquaculture",
    title: "Revive Artemia Cyst",
    tagline:
      "Premium-grade brine shrimp cysts for hatchery success — proven survival, growth and performance without cold-chain limitations. Also a favorite live feed for home aquariums and reef tanks.",
    tags: [
      "Hatching Rate 85%",
      "Long shelf life",
      "Used across TR · KR · MENA",
      "Aquarium & Reef Ready",
    ],
    description:
      "Revive Artemia Cysts offer high hatch-out efficiency, long shelf life and nutritional consistency for larval-stage fish and shrimp. Backed by global performance data and used by hatcheries across Türkiye, South Korea and the Middle East, this product delivers proven results without cold-chain limitations. The same easy-to-hatch cysts are a trusted staple for public aquariums, pet shops, fish breeders and reef tank hobbyists worldwide.",
    longDescription: [
      "CPG (Number of Cyst per Gram) varies with size and genus of Artemia and is not a quality indicator on its own. Quality is defined by Hatching Rate and by the nutritional value and biomass of the resulting nauplii.",
      "We guarantee superior product quality and consistency with a stable hatching rate of at least 85%. Every year, about 700 tons of wet Artemia and 400 tons of dry cyst and processed Artemia are harvested from our two lakes.",
    ],
    metrics: [
      { label: "Hatching Rate", value: "85%" },
      { label: "CPG", value: "210,000" },
      { label: "Protein", value: "55%" },
      { label: "Fat", value: "12%" },
    ],
    specifications: [
      { label: "Product Form", value: "Dry Artemia Cyst" },
      { label: "Guaranteed Hatch Rate", value: "≥ 85%" },
      { label: "Packaging", value: "100 g / 200 g / 425 g vacuum cans · bulk" },
      { label: "Origin", value: "VARS-managed lakes" },
      { label: "Annual Harvest", value: "~700 t wet · ~400 t dry / processed" },
    ],
    applications: [
      "Marine finfish larvae (sea bass, sea bream, grouper)",
      "Shrimp post-larvae",
      "Ornamental fish larvae",
      "Home aquariums & reef tanks",
      "Public aquariums & pet shops",
    ],
    storage: "Store below 4 °C. Vacuum-sealed cans remain viable for up to 36 months.",
    image: reviveCysts.url,
    gallery: reviveCysts.gallery,
    pdfUrl: odooAssetUrl(
      "/web/content/12514?unique=24692c2e204e6066d0f586050b3232512eef996c&download=true&access_token=574dfe3e-ca12-4943-884d-45a1fa2396ea",
    ),
    pdfLabel: "Artemia Cysts Incubation Procedure (PDF)",
    seoKeywords: [
      "Artemia cysts",
      "brine shrimp eggs",
      "Revive Artemia",
      "85% hatch rate Artemia",
      "Great Salt Lake Artemia",
      "hatching Artemia cysts",
      "larval live feed",
      "aquarium artemia cysts",
      "reef tank brine shrimp",
      "home aquarium live feed",
    ],
    searchSynonyms: [
      "artemia",
      "brine shrimp",
      "hatching cysts",
      "artemia nauplii",
      "aquarium brine shrimp",
      "reef tank live feed",
      "artemia eggs",
      "live larval feed",
    ],
  },
  {
    slug: "emerald-chlorella-powder",
    category: "live-feed-aquaculture",
    title: "Emerald Chlorella Powder",
    tagline:
      "Superior purity and consistent performance — microalgae-based live feed designed for hatcheries and aquaculture professionals.",
    tags: ["Protein 60.6 g", "Vitamin B12 rich", "Immune support"],
    description:
      "Emerald Chlorella Powder is designed specifically for hatcheries and aquaculture professionals seeking a dependable microalgae-based live feed solution. It enhances larval growth, strengthens immune response and promotes higher survival rates.",
    highlights: [
      "Protein content 60.6 g / 100 g",
      "Rich in Vitamin B12 (1000 µg/100 g)",
      "Supports rotifer & copepod green-water cultures",
      "Strengthens immune response in marine larvae",
    ],
    metrics: [
      { label: "Protein", value: "60.6 g" },
      { label: "Carbohydrate", value: "15.7 g" },
      { label: "Calories", value: "> 372 kcal" },
      { label: "Vitamin B12", value: "1000 µg/100 g" },
    ],
    specifications: [
      { label: "Form", value: "Spray-dried powder" },
      { label: "Moisture", value: "135 g/l" },
      { label: "Vitamin C", value: "74 mg/100 g" },
      { label: "Vitamin D", value: "277.6 µg/100 g" },
      { label: "Vitamin E", value: "22.8 mg/100 g" },
      { label: "Packaging", value: "1 kg / 5 kg / 20 kg" },
    ],
    applications: [
      "Rotifer green-water culture",
      "Copepod culture",
      "Larval immune support",
      "Marine hatchery enrichment protocols",
    ],
    storage:
      "Store below 8 °C after opening. Keep in sealed packaging away from light and moisture.",
    image: emeraldChlorella.url,
    gallery: emeraldChlorella.gallery,
    seoKeywords: [
      "emerald chlorella powder",
      "spray dried chlorella",
      "microalgae powder aquafeed",
      "rotifer culture chlorella",
      "Chlorella pyrenoidosa powder",
    ],
    searchSynonyms: [
      "chlorella powder",
      "dry chlorella",
      "microalgae powder",
      "rotifer green water",
    ],
  },
  {
    slug: "super-fresh-chlorella-v12",
    category: "live-feed-aquaculture",
    title: "Super Fresh Chlorella SV-12",
    tagline:
      "Live liquid chlorella concentrate — freshly cultured, never dried or frozen, engineered for intensive rotifer culture.",
    tags: ["14 B cells/ml", "DHA · EPA · B12", "8× rotifers in 3 days"],
    description:
      "Super Fresh Chlorella V12 is specifically formulated for intensive rotifer culture. Each cell is rich in DHA, EPA and vitamin B12, providing superior nutrition. Freshly cultured and never dried or frozen, SV12 can increase rotifer populations up to eight-fold in three days — leading to healthier rotifers and better fish-larvae survival.",
    highlights: [
      "Live cell density: 14 billion cells / ml",
      "Freshly cultured — never dried or frozen",
      "Up to 8-fold rotifer population growth in 3 days",
      "Rich in DHA, EPA & Vitamin B12",
    ],
    metrics: [
      { label: "Chlorella Density", value: "14 billion cells / ml" },
      { label: "Cell Size", value: "2–4 µm" },
      { label: "Dry Net Weight", value: "135 g/l" },
      { label: "Vitamin B12", value: "> 320 µg/l" },
    ],
    specifications: [
      { label: "Form", value: "Live liquid concentrate" },
      { label: "Preservation", value: "Freshly cultured — never dried or frozen" },
      { label: "Packaging", value: "2 L / 10 L bag-in-box" },
      { label: "Cold chain", value: "2–6 °C, protected from light" },
    ],
    applications: [
      "Intensive rotifer culture",
      "Copepod feed",
      "Marine hatchery green-water systems",
    ],
    storage:
      "Refrigerated 2–6 °C, keep away from direct light. Use as directed for continuous rotifer culture.",
    image: sv12.url,
    gallery: sv12.gallery,
    pdfUrl: odooAssetUrl(
      "/web/content/12196?unique=5277fa90217f35f33cb218e8be14e6eaf5099a9e&download=true&access_token=6519fa24-e835-4945-865c-2dadb4e8cba0",
    ),
    pdfLabel: "Super Fresh Chlorella SV-12 Datasheet (PDF)",
    seoKeywords: [
      "Super Fresh Chlorella V12",
      "Chlorella V12",
      "green water microalgae",
      "rotifer culture feed",
      "rotifer enrichment microalgae",
      "live Chlorella concentrate",
      "Chlorella vulgaris",
    ],
    searchSynonyms: [
      "chlorella",
      "green water",
      "rotifer feed",
      "freshwater chlorella",
      "condensed microalgae",
      "v12 chlorella",
      "microalgal concentrate",
    ],
  },

  // ────────────────── Seafood ──────────────────
  {
    slug: "shrimp",
    category: "seafood",
    title: "Shrimp",
    tagline:
      "Clean taste, high-protein and versatile — farmed and wild-caught shrimp with export-grade certifications.",
    tags: ["High-protein · low-fat", "ASC · GlobalG.A.P", "Wholesale · HORECA · Retail"],
    description:
      "Shrimp is one of the most demanded seafood products globally, valued for its clean taste, high protein content and versatility across cuisines. At VARS Aquaculture we source shrimp from trusted aquaculture farms and certified fisheries, ensuring premium quality, consistent supply and export-ready standards.",
    highlights: [
      "Farmed & wild-caught shrimp options",
      "High-protein, low-fat seafood product",
      "Export-grade quality with international certifications",
      "Processed and packed for maximum freshness",
      "Suitable for wholesale, HORECA and retail markets",
    ],
    metrics: [
      { label: "Energy", value: "99 kcal" },
      { label: "Protein", value: "24 g" },
      { label: "PUFA", value: "0.3 g" },
      { label: "MUFA", value: "0.2 g" },
    ],
    specifications: [
      { label: "Standards", value: "ASC & GlobalG.A.P compliant" },
      {
        label: "Formats",
        value: "Whole (H/L) · P&D · Cooked · Tail-on/off · IQF · Fresh/frozen/canned/smoked",
      },
      {
        label: "Size grades",
        value: "Small 100–200/kg · Medium 60–100/kg · Large 30–60/kg · Jumbo 10–30/kg",
      },
      { label: "Packaging", value: "6 kg or 10 kg EPS units" },
      { label: "Availability", value: "52-week production" },
      { label: "SFA", value: "0.2 g" },
      { label: "Salt", value: "0.15 g" },
      { label: "Logistics", value: "Fresh delivery to EMEA & North America" },
    ],
    applications: ["Retail wholesale", "Foodservice / HORECA", "Processing"],
    storage:
      "Fresh at 0–2 °C: 5–7 days. Frozen at −40 °C: up to 18 months. Handled under strict cold-chain.",
    image: shrimp.url,
    gallery: shrimp.gallery,
  },
  {
    slug: "mediterranean-sea-bass",
    category: "seafood",
    title: "Mediterranean Sea Bass",
    latinName: "Dicentrarchus labrax",
    tagline:
      "One of the most in-demand fish in the Mediterranean — delicate flavor, meaty texture, high nutritional value.",
    tags: ["ASC · GlobalG.A.P", "Year-round", "EU & MENA export"],
    description:
      "The Mediterranean Sea Bass is one of the most in-demand fish in the Mediterranean region, known for its delicate flavor, meaty texture and high nutritional value. At VARS Aquaculture we supply only from leading, certified Mediterranean farms, ensuring year-round availability, sustainable practices and top export quality.",
    longDescription: [
      "International standards compliant with ASC and GlobalG.A.P protocols for export excellence.",
      "Continuous production cycles ensure 52-week availability for global wholesale, with optimized logistics for regular fresh deliveries across the EMEA and North American markets.",
    ],
    highlights: [
      "International Quality Standards (ASC & GlobalG.A.P)",
      "Long-term supply chain stability via Mediterranean hub alliances",
      "52-week continuous production",
      "Optimized EMEA & North America logistics",
    ],
    metrics: [
      { label: "Energy", value: "114 kcal" },
      { label: "Protein", value: "22.25 g" },
      { label: "PUFA", value: "0.83 g" },
      { label: "MUFA", value: "1.10 g" },
    ],
    specifications: [
      { label: "Product forms", value: "Whole Round · Descaled & Gutted · Dressed · Fillets" },
      { label: "Preservation", value: "Fresh / Frozen / Canned / Smoked" },
      { label: "Storage", value: "0 to +2 °C fresh · −18 °C deep-frozen" },
      { label: "Size groups", value: "XS 100–300 g · Medium 300–600 g · Large 600 g+" },
      { label: "Salt", value: "0.12 g" },
      { label: "SFA", value: "0.54 g" },
    ],
    applications: ["Canning & smoking", "HORECA / restaurant", "Retail wholesale", "Processing"],
    storage: "Optimal preservation at 0 °C to +2 °C for fresh; −18 °C for deep-frozen fillets.",
    image: seaBassImg.url,
    culinaryInfo: {
      whyChooseTitle: "Why Choose VARS Sea Bass?",
      whyChoosePoints: [
        {
          title: "Essential Fatty Acids",
          desc: "High Omega-3 content and essential micronutrients maintained through specialized bio-diets.",
        },
        {
          title: "Architectural Texture",
          desc: "Muscle density achieved through high-flow water environments, perfect for precision slicing.",
        },
        {
          title: "Market Versatility",
          desc: "From quick-service premium casual to Michelin-star fine dining, our Sea Bass adapts to any culinary vision.",
        },
      ],
      cookingSuggestions: [
        "Oven-baking whole with herbs and olive oil",
        "Crispy skin pan-frying",
        "Charcoal grilling",
        "Mediterranean salt-crust roasting",
      ],
      flavorProfile:
        "Mild, sweet flavor with a firm, flaky texture that holds its shape during high-heat preparation.",
      sizeGroups: [
        { group: "XS-Small", weight: "100–300 g", application: "Canning & Portioning" },
        {
          group: "Medium (HoReCa)",
          weight: "300–600 g",
          application: "Restaurant Standard Portion",
        },
        { group: "Large Selection", weight: "600–800 g", application: "Fine Dining Whole Fish" },
        { group: "Executive Cut", weight: "800–1500 g", application: "Premium Fillet & Steak" },
      ],
      nutritionalNumbers: [
        { label: "Energy", value: "114 kcal" },
        { label: "Protein", value: "22.25 g" },
        { label: "Saturated Fats", value: "0.54 g" },
        { label: "Monounsaturated Fats", value: "1.10 g" },
        { label: "Polyunsaturated Fats", value: "0.83 g" },
        { label: "Salt", value: "0.12 g" },
      ],
    },
    seoKeywords: [
      "Mediterranean Sea Bass",
      "Dicentrarchus labrax",
      "Branzino wholesale",
      "loup de mer export",
      "fresh sea bass export",
      "D&G sea bass",
      "air freight sea bass",
      "European sea bass",
    ],
    searchSynonyms: [
      "seabass",
      "sea bass",
      "branzino",
      "loup de mer",
      "levrek",
      "fresh seabass",
      "D&G bass",
    ],
  },
  {
    slug: "mediterranean-sea-bream",
    category: "seafood",
    title: "Mediterranean Sea Bream",
    latinName: "Sparus aurata",
    tagline:
      "Gilthead sea bream — delicate flavor, firm flesh and exceptional nutritional profile from certified Mediterranean farms.",
    tags: ["ASC · GlobalG.A.P", "Whole / D&G / Fillet", "EU export"],
    description:
      "The Mediterranean Sea Bream (Sparus aurata), also known as gilthead sea bream, is one of the Mediterranean's most prized fish, valued for its delicate flavor, firm flesh and exceptional nutritional profile. At VARS Aquaculture we source from leading certified farms in the Mediterranean region, ensuring sustainable production, year-round availability and the highest export quality.",
    highlights: [
      "ASC & GlobalG.A.P certified Mediterranean farms",
      "Delicate flavor and firm white flesh",
      "Available whole, gutted, dressed, or filleted",
      "52-week continuous production and global delivery",
    ],
    metrics: [
      { label: "Energy", value: "134 kcal" },
      { label: "Protein", value: "20.44 g" },
      { label: "PUFA", value: "1.85 g" },
      { label: "MUFA", value: "2.50 g" },
    ],
    specifications: [
      { label: "Product forms", value: "Whole Round · Descaled & Gutted · Dressed · Fillets" },
      { label: "Preservation", value: "Fresh / Frozen / Canned / Smoked" },
      { label: "Storage", value: "0 to +2 °C fresh · −18 °C deep-frozen" },
      { label: "Size groups", value: "XS 100–300 g · Medium 300–600 g · Large 600 g+" },
      { label: "Salt", value: "0.12 g" },
      { label: "SFA", value: "1.13 g" },
    ],
    applications: ["Canning & smoking", "HORECA / restaurant", "Retail wholesale"],
    storage:
      "Optimal preservation at 0 °C to +2 °C for fresh variants; −18 °C for deep-frozen fillets.",
    image: seaBream.url,
    pdfUrl: odooDirectUrl("/odoo/documents/7xL4XfbBRhmb9LH2LJF86Qo287"),
    pdfLabel: "VARS Seafood Catalogue",
    culinaryInfo: {
      whyChooseTitle: "Why Choose VARS Sea Bream?",
      whyChoosePoints: [
        {
          title: "Rich Lipid Balance",
          desc: "Naturally balanced fat content yielding succulent, juicy white flesh upon grilling.",
        },
        {
          title: "Farming Integrity",
          desc: "Cultured in open sea cages with pristine Mediterranean water exchange.",
        },
        {
          title: "Culinary Agility",
          desc: "Exceptional response to Mediterranean citrus, olive oil, and rosemary marinades.",
        },
      ],
      cookingSuggestions: [
        "Whole fish charcoal grilling",
        "Pan-seared fillets with lemon and garlic",
        "Oven baking with roasted vine tomatoes",
        "Mediterranean seafood bouillabaisse",
      ],
      flavorProfile:
        "Moist, tender white meat with a succulent, slightly sweet flavor profile prized in Mediterranean gastronomy.",
      sizeGroups: [
        { group: "XS-Small", weight: "100–300 g", application: "Smoking & Processing" },
        {
          group: "Medium (HoReCa)",
          weight: "300–600 g",
          application: "Hotel & Restaurant Entrees",
        },
        {
          group: "Large Selection",
          weight: "600–800 g",
          application: "Sharing Platter Whole Roast",
        },
        { group: "Executive Cut", weight: "800–1200 g", application: "Chef Special Whole Fish" },
      ],
      nutritionalNumbers: [
        { label: "Energy", value: "134 kcal" },
        { label: "Protein", value: "20.44 g" },
        { label: "Saturated Fats", value: "1.13 g" },
        { label: "Monounsaturated Fats", value: "2.50 g" },
        { label: "Polyunsaturated Fats", value: "1.85 g" },
        { label: "Salt", value: "0.12 g" },
      ],
    },
    seoKeywords: [
      "Mediterranean Sea Bream",
      "Sparus aurata",
      "Dorade Royale wholesale",
      "gilt head sea bream",
      "fresh sea bream export",
      "D&G sea bream",
      "European sea bream",
    ],
    searchSynonyms: [
      "seabream",
      "sea bream",
      "dorade",
      "gilt-head bream",
      "çipura",
      "fresh seabream",
      "dorade royale",
    ],
  },
  {
    slug: "amberjack",
    category: "seafood",
    title: "Greater Amberjack",
    latinName: "Seriola dumerili",
    tagline:
      "Turkey-origin Greater Amberjack — firm texture, export-grade quality for wholesale, HORECA and premium distribution.",
    tags: ["Akya Fish", "Mediterranean Amberjack", "EU · Middle East"],
    description:
      "Greater Amberjack is widely valued in wholesale, foodservice and premium distribution channels for its firm texture and versatility. Also traded as Amberjack, Mediterranean Amberjack, and Akya Fish. Export-grade quality aligned with EU and Middle East standards.",
    highlights: [
      "Turkey-origin Greater Amberjack (Seriola dumerili)",
      "Export-grade quality aligned with EU and Middle East standards",
      "Suitable for wholesale, HORECA and distribution markets",
    ],
    metrics: [
      { label: "Energy", value: "145 kcal" },
      { label: "Protein", value: "20.5 g" },
      { label: "PUFA", value: "2.7 g" },
      { label: "MUFA", value: "1.7 g" },
    ],
    specifications: [
      { label: "Standards", value: "ASC & GlobalG.A.P compliant" },
      { label: "Availability", value: "52-week continuous production" },
      { label: "SFA", value: "1.3 g" },
      { label: "Salt", value: "0.1 g" },
      { label: "Logistics", value: "EMEA & North America fresh delivery" },
    ],
    applications: ["Sashimi and premium grill", "HORECA / restaurant", "Wholesale & distribution"],
    storage: "Hold at 0 – 2 °C on flake ice; strict cold-chain from harvest to delivery.",
    image: amberjack.url,
    seoKeywords: [
      "Mediterranean Amberjack",
      "Seriola dumerili",
      "yellowtail amberjack",
      "sashimi grade amberjack",
      "fresh amberjack wholesale",
      "Akya fish export",
    ],
    searchSynonyms: [
      "amberjack",
      "yellowtail",
      "seriola",
      "sashimi amberjack",
      "akya",
      "amberjack export",
    ],
  },
  {
    slug: "rainbow-trout",
    category: "seafood",
    title: "Rainbow Trout",
    latinName: "Oncorhynchus mykiss",
    tagline:
      "Mild flavor, tender texture, high nutritional value — farmed rainbow trout for retail, foodservice and premium distribution.",
    tags: ["EU export standards", "Year-round", "Wholesale · HORECA · Retail"],
    description:
      "Rainbow Trout is globally valued for its mild flavor, tender texture and high nutritional value, making it ideal for retail, foodservice and premium distribution channels. Sourced from certified aquaculture farms with export-grade quality aligned with EU standards.",
    highlights: [
      "Farmed Rainbow Trout (Oncorhynchus mykiss)",
      "Sourced from certified aquaculture farms",
      "Export-grade quality aligned with EU standards",
      "Year-round availability",
      "Suitable for wholesale, HORECA and retail markets",
    ],
    metrics: [
      { label: "Energy", value: "130 kcal" },
      { label: "Protein", value: "21 g" },
      { label: "PUFA", value: "1.6 g" },
      { label: "MUFA", value: "2.0 g" },
    ],
    specifications: [
      { label: "Product forms", value: "Whole Round · D&G · Fillets" },
      { label: "Standards", value: "ASC & GlobalG.A.P compliant" },
      { label: "SFA", value: "1.1 g" },
      { label: "Salt", value: "0.1 g" },
      { label: "Logistics", value: "Fresh delivery to EMEA & North America" },
    ],
    applications: ["Smoke house", "HORECA / restaurant", "Retail wholesale"],
    storage: "Hold at 0 – 2 °C on flake ice; maintain cold-chain from harvest to delivery.",
    image: rainbowTrout.url,
    seoKeywords: [
      "Rainbow Trout wholesale",
      "Oncorhynchus mykiss",
      "farmed rainbow trout export",
      "fresh trout fillets",
      "smoked trout wholesale",
    ],
    searchSynonyms: ["rainbow trout", "trout", "alabalık", "fresh trout", "trout fillets"],
  },
  {
    slug: "olive-flounder",
    category: "seafood",
    title: "Olive Flounder",
    latinName: "Paralichthys olivaceus",
    tagline:
      "One of the world's most valuable marine species — the top farmed finfish in South Korea for over two decades.",
    tags: ["Sushi / Sashimi grade", "ASC · GlobalG.A.P", "Fine dining"],
    description:
      "The Olive Flounder (Paralichthys olivaceus) has been the top farmed finfish in South Korea for over two decades. Known for its delicate flavor, tender texture and high nutritional value, it is a premium choice for sushi, sashimi and high-end culinary applications. At VARS Aquaculture we source olive flounders from trusted, certified farms, ensuring sustainability, year-round availability and export-grade quality.",
    highlights: [
      "Top farmed finfish in South Korea for over two decades",
      "Sushi & sashimi grade delicate flavor and firm texture",
      "ASC & GlobalG.A.P compliant farming standards",
      "52-week harvest cycles with fresh EMEA & NA delivery",
    ],
    metrics: [
      { label: "Energy", value: "91 kcal" },
      { label: "Protein", value: "18.8 g" },
      { label: "PUFA", value: "0.26 g" },
      { label: "MUFA", value: "0.65 g" },
    ],
    specifications: [
      { label: "Standards", value: "ASC & GlobalG.A.P compliant" },
      // Origin moved out of the product title and into the specs: buyers search
      // "olive flounder", not "Korean olive flounder", but the sourcing origin
      // is still a fact they need before they quote.
      { label: "Origin", value: "South Korea — certified partner farms" },
      { label: "Availability", value: "Year-round, 52-week harvest cycles" },
      { label: "SFA", value: "0.28 g" },
      { label: "Salt", value: "0.23 g" },
      { label: "Logistics", value: "EMEA & North America fresh delivery" },
    ],
    exportForms: [
      {
        key: "frozen-fillet",
        name: "Frozen fillet",
        summary:
          "Skin-on fillets frozen to export grade, cut two per fish and graded by piece weight.",
        sizes: ["400 – 500 g/pc", "500 – 600 g/pc"],
        options: [
          {
            label: "Fins",
            value:
              "Attached or trimmed, to order. Korean buyers typically ask for fins on; it is your choice.",
          },
          { label: "Seasoning", value: "Plain, or lightly salted on request." },
        ],
        notes:
          "Two fillets come from one fish, so piece weight follows harvest size: our largest grade, a 2.0 – 2.5 kg live fish, yields the 500 – 600 g/pc band.",
      },
      {
        key: "fresh-gutted",
        name: "Fresh gutted",
        summary:
          "Whole gutted fish on flake ice, air-freighted for raw-market and sashimi counters.",
        sizes: [
          "400 – 600 g/pc",
          "600 – 800 g/pc",
          "800 – 1000 g/pc",
          "1000 – 1200 g/pc",
          "1200 – 1500 g/pc",
          "1500 – 2000 g/pc",
          "2000 – 2500 g/pc",
        ],
        notes: "2.0 – 2.5 kg is the largest live fish we produce, which sets the top band.",
      },
      {
        key: "live",
        name: "Live",
        summary:
          "Packed in oxygen-filled bags or dedicated air containers for live-tank restaurants and retail.",
        options: [
          {
            label: "Viability window",
            value:
              "24 – 30 hours door-to-door under optimal conditions. Beyond 30 hours the risk rises sharply and we will not ship it.",
          },
          {
            label: "Worked example — Korea to the Gulf",
            value:
              "3 – 5 h packing and transfer to ICN, 9 – 10 h flight, 3 – 6 h arrival handling, customs and pickup. Roughly 18 – 24 h total, inside the safe window.",
          },
        ],
        notes:
          "Tell us the destination airport and we will confirm whether the corridor fits the window before you commit to an order.",
      },
    ],
    exportDocuments: [
      "TRACES",
      "Certificate of Analysis (CoA)",
      "Certificate of Origin",
      "GlobalG.A.P",
      "ASC",
    ],
    applications: ["Sushi & sashimi", "Fine dining HORECA", "Premium retail"],
    storage: "Hold at 0 – 2 °C on flake ice; strict cold-chain from harvest to delivery.",
    image: oliveFlounder.url,
    pdfUrl: odooDirectUrl("/odoo/documents/7xL4XfbBRhmb9LH2LJF86Qo287"),
    pdfLabel: "VARS Seafood Catalogue",
    seoKeywords: [
      "Korean Olive Flounder",
      "Paralichthys olivaceus",
      "Hirame wholesale",
      "flatfish export",
      "sashimi grade flounder",
    ],
    searchSynonyms: ["olive flounder", "hirame", "flounder", "flatfish", "korean flounder"],
  },
  {
    slug: "brown-meagre",
    category: "seafood",
    title: "Brown Meagre",
    latinName: "Sciaena umbra",
    tagline:
      "Mild sweet flavor, tender white flesh — high-protein, low-fat Mediterranean species from certified farms.",
    tags: ["ASC · GlobalG.A.P", "High protein · low fat", "Fine dining"],
    description:
      "The Brown Meagre (Sciaena umbra) is a prized Mediterranean species known for its mild, sweet flavor and tender, white flesh. Popular with chefs and seafood enthusiasts, it offers a high-protein, low-fat profile. At VARS Aquaculture we source Brown Meagre from certified Mediterranean farms, ensuring year-round availability, sustainable practices and export-grade freshness.",
    highlights: [
      "Prized Mediterranean species with mild, sweet flavor",
      "High-protein, low-fat nutritional profile",
      "Sourced from certified Mediterranean farms",
      "52-week continuous production for fine dining & wholesale",
    ],
    metrics: [
      { label: "Energy", value: "93 kcal" },
      { label: "Protein", value: "18 g" },
      { label: "SFA", value: "0.64 g" },
      { label: "PUFA", value: "0.68 g" },
    ],
    seoKeywords: [
      "VARS Brown Meagre",
      "Argyrosomus regius",
      "Corvina wholesale",
      "stone bass export",
      "fresh Mediterranean meagre",
      "gutted brown meagre",
    ],
    searchSynonyms: [
      "brown meagre",
      "meagre",
      "corvina",
      "stone bass",
      "meagre fish",
      "fresh meagre export",
    ],
    specifications: [
      { label: "Standards", value: "ASC & GlobalG.A.P compliant" },
      { label: "Availability", value: "52-week continuous production" },
      { label: "MUFA", value: "0.72 g" },
      { label: "Salt", value: "0.06 g" },
      { label: "Logistics", value: "Regular fresh deliveries to EMEA & North America" },
    ],
    applications: ["Fine dining HORECA", "Premium retail", "Export wholesale"],
    storage: "Store on flake ice at 0 – 2 °C.",
    image: brownMeagre.url,
    culinaryInfo: {
      whyChooseTitle: "Why Choose VARS Brown Meagre?",
      whyChoosePoints: [
        {
          title: "Essential Fatty Acids",
          desc: "High Omega-3 content and essential micronutrients maintained through specialized bio-diets.",
        },
        {
          title: "Architectural Texture",
          desc: "Muscle density achieved through high-flow water environments, perfect for precision slicing.",
        },
        {
          title: "Market Versatility",
          desc: "From quick-service premium casual to Michelin-star fine dining, our fish adapts to any culinary vision.",
        },
      ],
      cookingSuggestions: [
        "Grilled whole with herbs and lemon",
        "Oven-baked with Mediterranean vegetables",
        "Pan-fried fillets with olive oil",
        "Steamed for a delicate texture",
      ],
      flavorProfile:
        "This fish offers lean, flavorful meat with a mild taste, making it ideal for a variety of recipes. It is easy to prepare and pairs perfectly with Mediterranean flavors.",
      sizeGroups: [
        { group: "XS-Small", weight: "100–200g / 200–300g", application: "Canning & Smoking" },
        {
          group: "Medium (HoReCa)",
          weight: "300–400g / 400–600g",
          application: "Restaurant Standard",
        },
        {
          group: "Large Selection",
          weight: "600–800g / 800–1000g",
          application: "Fine Dining Whole Roast",
        },
        { group: "Executive Cut", weight: "1000–1500g", application: "Premium Fillet Steak" },
      ],
      nutritionalNumbers: [
        { label: "Energy", value: "93 kcal" },
        { label: "Protein", value: "18 g" },
        { label: "Saturated Fats", value: "0.64 g" },
        { label: "Polyunsaturated Fats", value: "0.68 g" },
        { label: "Monounsaturated Fats", value: "0.72 g" },
        { label: "Salt", value: "0.06 g" },
      ],
    },
  },
  {
    slug: "blue-crab",
    category: "seafood",
    title: "Blue Crab",
    tagline:
      "Sweet, delicate meat with rich flavor — live, fresh-frozen and boiled-frozen blue crab from sustainable fisheries.",
    tags: ["Wild-caught", "Live / Frozen / Boiled", "HORECA · Processing"],
    description:
      "Blue Crab is a premium seafood product, valued for its sweet, delicate meat and rich flavor, widely used in global cuisines and high-end foodservice markets. At VARS Aquaculture we supply live, fresh-frozen and boiled-frozen blue crabs, handled with strict quality control to preserve freshness, texture and taste.",
    highlights: [
      "Wild-caught from sustainable fisheries",
      "Sweet, high-quality white meat",
      "Available in live and frozen formats",
      "Export-grade quality with international standards",
      "Suitable for wholesale, HORECA and processing markets",
    ],
    metrics: [
      { label: "Energy", value: "90 kcal" },
      { label: "Protein", value: "19 g" },
      { label: "PUFA", value: "0.4 g" },
      { label: "MUFA", value: "0.3 g" },
    ],
    specifications: [
      { label: "Standards", value: "ASC & GlobalG.A.P compliant" },
      { label: "Formats", value: "Live · Fresh-frozen · Boiled-frozen" },
      { label: "SFA", value: "0.3 g" },
      { label: "Salt", value: "0.25 g" },
      { label: "Logistics", value: "Fresh delivery to EMEA & North America" },
    ],
    applications: ["HORECA / restaurant", "Processing", "Wholesale distribution"],
    storage: "Live product chilled at 0–4 °C; frozen products at −18 °C.",
    image: seaBream.url,
  },
  {
    slug: "oyster",
    category: "seafood",
    title: "Oyster",
    tagline:
      "Briny-sweet flavor, smooth texture — premium oysters from clean, nutrient-rich waters and certified farms.",
    tags: ["Depurated", "Live / Processed", "Fine dining"],
    description:
      "Oysters are a premium seafood delicacy, valued for their briny-sweet flavor, smooth texture and high nutritional value — widely used in fine dining and raw seafood applications. At VARS Aquaculture we source oysters from clean, nutrient-rich waters and certified farms, ensuring consistent quality, sustainability and export-ready standards.",
    highlights: [
      "Farmed oysters from certified, clean waters",
      "Depurated (purified) for safe consumption",
      "Premium live and processed formats available",
      "Export-grade quality with international certifications",
      "Ideal for wholesale, HORECA and premium markets",
    ],
    metrics: [
      { label: "Energy", value: "65 kcal" },
      { label: "Protein", value: "6.6 g" },
      { label: "PUFA", value: "0.3 g" },
      { label: "MUFA", value: "0.2 g" },
    ],
    specifications: [
      { label: "Standards", value: "ASC & GlobalG.A.P compliant" },
      {
        label: "Formats",
        value: "Live (in shell) · Shucked · Frozen · Fresh/frozen/canned/smoked",
      },
      {
        label: "Size grades",
        value: "Small 12–18/kg · Medium 8–12/kg · Large 5–8/kg · Premium 3–5/kg",
      },
      { label: "Handling", value: "Depurated under strict hygiene controls" },
      { label: "SFA", value: "0.2 g" },
      { label: "Salt", value: "0.3 g" },
    ],
    applications: ["Fine dining", "Premium retail", "HORECA / raw bar"],
    storage: "Fresh at 0–2 °C: 10–14 days. Frozen at −40 °C: up to 12 months.",
    image: oyster.url,
  },
];

export function getCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}
export function getProductsByCategory(slug: string) {
  return PRODUCTS.filter((p) => p.category === slug);
}
export function getProduct(category: string, slug: string) {
  return PRODUCTS.find((p) => p.category === category && p.slug === slug);
}
