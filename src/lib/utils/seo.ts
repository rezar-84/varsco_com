import { LangCode } from "@/lib/types";

export interface PageMeta {
  title: string;
  description: string;
}

export type SeoPage =
  | "home"
  | "about"
  | "products"
  | "blog"
  | "services"
  | "projects"
  | "seafood"
  | "seafoodEurope"
  | "contact"
  | "quote"
  | "faq"
  | "salmonOva"
  | "coho"
  | "artemiaGuide"
  | "decapGuide"
  | "horeca"
  | "regionalTrade"
  | "aquariums"
  | "privacy"
  | "terms"
  | "login"
  | "register"
  | "account"
  | "cart"
  | "shop"
  | "checkout";

/*
 * Search engines do not use meta keywords as a ranking signal. These page
 * descriptions intentionally keep the site's established commercial terms
 * (live feed, Artemia, salmon eggs, seafood export, B2B) in natural copy.
 * Keeping this data here makes SSR metadata and all locale variants auditable.
 */
const SEO_COPY: Partial<Record<SeoPage, Record<LangCode, PageMeta>>> = {
  services: {
    en: {
      title: "Aquaculture Consulting, Sourcing & Export Solutions | VARS",
      description:
        "Expert aquaculture consulting, hatchery and RAS support, feed sourcing, troubleshooting, and export readiness for international B2B buyers.",
    },
    tr: {
      title: "Su Ürünleri Danışmanlığı, Tedarik ve İhracat Çözümleri | VARS",
      description:
        "Uluslararası B2B alıcılar için akvakültür danışmanlığı, kuluçkahane ve RAS desteği, yem tedariki, sorun giderme ve ihracata hazırlık.",
    },
    de: {
      title: "Aquakulturberatung, Beschaffung und Exportlösungen | VARS",
      description:
        "Aquakulturberatung, Brüterei- und RAS-Unterstützung, Futtermittelbeschaffung, Fehleranalyse und Exportvorbereitung für B2B-Kunden.",
    },
    ar: {
      title: "استشارات الاستزراع المائي وحلول التوريد والتصدير | VARS",
      description:
        "استشارات الاستزراع المائي ودعم المفرخات وأنظمة RAS وتوريد الأعلاف والاستعداد للتصدير للمشترين الدوليين من الشركات.",
    },
    ru: {
      title: "Консалтинг, снабжение и экспортные решения в аквакультуре | VARS",
      description:
        "Консалтинг по аквакультуре, поддержка инкубаторов и RAS, поставки кормов и подготовка экспорта для международных B2B-клиентов.",
    },
    ja: {
      title: "養殖コンサルティング・調達・輸出ソリューション | VARS",
      description:
        "海外B2Bバイヤー向けに、養殖コンサルティング、ふ化場・RAS支援、飼料調達、輸出準備を提供します。",
    },
    ko: {
      title: "양식 컨설팅·조달·수출 솔루션 | VARS",
      description:
        "국제 B2B 바이어를 위한 양식 컨설팅, 부화장·RAS 지원, 사료 조달, 문제 해결 및 수출 준비를 제공합니다.",
    },
    zh: {
      title: "水产养殖咨询、采购与出口解决方案 | VARS",
      description:
        "为国际B2B买家提供水产养殖咨询、孵化场与RAS支持、饲料采购、问题诊断和出口准备服务。",
    },
    es: {
      title: "Consultoría, suministro y soluciones de exportación acuícola | VARS",
      description:
        "Consultoría acuícola, apoyo a criaderos y RAS, suministro de piensos, resolución de problemas y preparación para exportación B2B.",
    },
  },
  projects: {
    en: {
      title: "Aquaculture Projects & Supply Chain Case Studies | VARS",
      description:
        "Review VARS aquaculture projects, hatchery trials, salmon egg exports, live feed optimization, and international supply-chain results.",
    },
    tr: {
      title: "Akvakültür Projeleri ve Tedarik Zinciri Vaka Çalışmaları | VARS",
      description:
        "VARS akvakültür projelerini, kuluçkahane denemelerini, somon yumurtası ihracatını ve canlı yem optimizasyonu sonuçlarını inceleyin.",
    },
    de: {
      title: "Aquakulturprojekte und Lieferketten-Fallstudien | VARS",
      description:
        "Entdecken Sie VARS-Projekte, Brüterei-Versuche, Lachseierexporte, Lebendfutteroptimierung und internationale Lieferketten.",
    },
    ar: {
      title: "مشاريع الاستزراع المائي ودراسات سلسلة التوريد | VARS",
      description:
        "اطلع على مشاريع VARS وتجارب المفرخات وتصدير بيض السلمون وتحسين الأعلاف الحية ونتائج سلاسل التوريد الدولية.",
    },
    ru: {
      title: "Проекты в аквакультуре и кейсы цепочки поставок | VARS",
      description:
        "Изучите проекты VARS, испытания на инкубаторах, экспорт икры лосося, оптимизацию живых кормов и международную логистику.",
    },
    ja: {
      title: "養殖プロジェクトとサプライチェーン事例 | VARS",
      description:
        "VARSの養殖プロジェクト、ふ化場試験、サーモン卵輸出、生餌の最適化、国際物流の成果を紹介します。",
    },
    ko: {
      title: "양식 프로젝트 및 공급망 사례 연구 | VARS",
      description:
        "VARS의 양식 프로젝트, 부화장 시험, 연어 수정란 수출, 생먹이 최적화 및 국제 공급망 성과를 확인하세요.",
    },
    zh: {
      title: "水产养殖项目与供应链案例 | VARS",
      description: "了解VARS的水产养殖项目、孵化场试验、鲑鱼卵出口、活饵优化和国际供应链成果。",
    },
    es: {
      title: "Proyectos acuícolas y casos de cadena de suministro | VARS",
      description:
        "Conozca los proyectos de VARS, ensayos de criadero, exportación de ovas de salmón, optimización de alimento vivo y logística internacional.",
    },
  },
  seafood: {
    en: {
      title: "Mediterranean Seafood Export from Türkiye | VARS Aquaculture",
      description:
        "B2B export of fresh sea bass, sea bream, trout, shrimp and other Mediterranean seafood from Türkiye with cold-chain logistics and documentation.",
    },
    tr: {
      title: "Türkiye'den Akdeniz Su Ürünleri İhracatı | VARS Aquaculture",
      description:
        "Soğuk zincir lojistiği ve ihracat belgeleriyle levrek, çipura, alabalık, karides ve diğer Akdeniz su ürünlerinde B2B tedarik.",
    },
    de: {
      title: "Export mediterraner Meeresfrüchte aus der Türkei | VARS",
      description:
        "B2B-Export von Wolfsbarsch, Dorade, Forelle, Garnelen und weiteren mediterranen Meeresfrüchten mit Kühlkette und Dokumentation.",
    },
    ar: {
      title: "تصدير المأكولات البحرية المتوسطية من تركيا | VARS",
      description:
        "تصدير B2B لسمك القاروص والدنيس والتراوت والروبيان والمأكولات البحرية المتوسطية مع سلسلة تبريد ووثائق كاملة.",
    },
    ru: {
      title: "Экспорт средиземноморских морепродуктов из Турции | VARS",
      description:
        "B2B-поставки сибаса, дорадо, форели, креветки и других морепродуктов со сквозной холодовой цепью и документами.",
    },
    ja: {
      title: "トルコ発・地中海水産物の輸出 | VARS Aquaculture",
      description:
        "スズキ、タイ、マス、エビなどの地中海水産物を、コールドチェーンと輸出書類付きでB2B供給します。",
    },
    ko: {
      title: "튀르키예산 지중해 수산물 수출 | VARS Aquaculture",
      description:
        "농어, 도미, 송어, 새우 등 지중해 수산물을 콜드체인과 수출 서류를 갖춰 B2B로 공급합니다.",
    },
    zh: {
      title: "土耳其地中海海鲜出口 | VARS Aquaculture",
      description: "提供鲈鱼、鲷鱼、鳟鱼、虾及其他地中海海鲜的B2B出口，并配套冷链物流和完整文件。",
    },
    es: {
      title: "Exportación de marisco mediterráneo desde Türkiye | VARS",
      description:
        "Exportación B2B de lubina, dorada, trucha, gambas y otros productos mediterráneos con cadena de frío y documentación.",
    },
  },
  seafoodEurope: {
    en: {
      title: "Seafood Export from Türkiye to Europe | VARS",
      description:
        "EU-ready sea bass, sea bream and trout exports from İzmir with TRACES documentation, cold-chain logistics and customs support.",
    },
    tr: {
      title: "Türkiye'den Avrupa'ya Su Ürünleri İhracatı | VARS",
      description:
        "İzmir'den Avrupa'ya TRACES belgeleri, soğuk zincir lojistiği ve gümrük desteğiyle levrek, çipura ve alabalık ihracatı.",
    },
    de: {
      title: "Meeresfrüchteexport aus der Türkei nach Europa | VARS",
      description:
        "EU-konformer Export von Wolfsbarsch, Dorade und Forelle aus İzmir mit TRACES, Kühlkette und Zollunterstützung.",
    },
    ar: {
      title: "تصدير المأكولات البحرية من تركيا إلى أوروبا | VARS",
      description:
        "تصدير القاروص والدنيس والتراوت من إزمير إلى أوروبا مع وثائق TRACES وسلسلة تبريد ودعم جمركي.",
    },
    ru: {
      title: "Экспорт морепродуктов из Турции в Европу | VARS",
      description:
        "Экспорт сибаса, дорадо и форели из Измира в ЕС с документами TRACES, холодовой цепью и таможенной поддержкой.",
    },
    ja: {
      title: "トルコから欧州への水産物輸出 | VARS",
      description:
        "TRACES書類、コールドチェーン、通関支援を備え、イズミルから欧州へスズキ、タイ、マスを輸出します。",
    },
    ko: {
      title: "튀르키예에서 유럽으로 수산물 수출 | VARS",
      description:
        "TRACES 서류, 콜드체인 및 통관 지원을 통해 이즈미르에서 유럽으로 농어·도미·송어를 수출합니다.",
    },
    zh: {
      title: "从土耳其向欧洲出口海鲜 | VARS",
      description: "从伊兹密尔向欧洲出口鲈鱼、鲷鱼和鳟鱼，提供TRACES文件、冷链物流和清关支持。",
    },
    es: {
      title: "Exportación de marisco de Türkiye a Europa | VARS",
      description:
        "Exportación de lubina, dorada y trucha desde Esmirna con documentación TRACES, cadena de frío y apoyo aduanero.",
    },
  },
  contact: {
    en: {
      title: "Contact VARS Aquaculture | Global B2B Export Desk",
      description:
        "Contact VARS in İzmir, Türkiye about salmon eggs, Artemia live feed, aquaculture inputs, seafood exports, and technical support.",
    },
    tr: {
      title: "VARS Aquaculture İletişim | Küresel B2B İhracat",
      description:
        "Somon yumurtası, Artemia canlı yemi, akvakültür girdileri, su ürünleri ihracatı ve teknik destek için İzmir VARS ekibine ulaşın.",
    },
    de: {
      title: "Kontakt zu VARS Aquaculture | Globaler B2B-Export",
      description:
        "Kontaktieren Sie VARS in İzmir zu Lachseiern, Artemia-Lebendfutter, Aquakulturbedarf, Meeresfrüchteexporten und technischer Unterstützung.",
    },
    ar: {
      title: "تواصل مع VARS للاستزراع المائي | مبيعات B2B العالمية",
      description:
        "تواصل مع فريق VARS في إزمير بشأن بيض السلمون والأرتيميا ومدخلات الاستزراع المائي وتصدير المأكولات البحرية والدعم الفني.",
    },
    ru: {
      title: "Связаться с VARS Aquaculture | Глобальный B2B-экспорт",
      description:
        "Свяжитесь с VARS в Измире по вопросам икры лосося, живого корма артемии, аквакультуры, морепродуктов и технической поддержки.",
    },
    ja: {
      title: "VARS Aquacultureへのお問い合わせ | B2B輸出",
      description:
        "サーモン卵、アルテミア、生産資材、水産物輸出、技術サポートについてイズミルのVARSへご連絡ください。",
    },
    ko: {
      title: "VARS Aquaculture 문의 | 글로벌 B2B 수출",
      description:
        "연어 수정란, 알테미아 생먹이, 양식 자재, 수산물 수출 및 기술 지원은 이즈미르 VARS에 문의하세요.",
    },
    zh: {
      title: "联系VARS水产养殖 | 全球B2B出口",
      description:
        "如需鲑鱼卵、丰年虫活饵、水产养殖投入品、海鲜出口或技术支持，请联系位于伊兹密尔的VARS。",
    },
    es: {
      title: "Contacte con VARS Aquaculture | Exportación B2B",
      description:
        "Contacte con VARS en Esmirna para ovas de salmón, alimento vivo Artemia, insumos acuícolas, exportación de marisco y soporte técnico.",
    },
  },
};

const GENERIC_SEO: Partial<Record<SeoPage, PageMeta>> = {
  quote: {
    title: "Request a B2B Aquaculture Quote | VARS",
    description:
      "Request a tailored quote for live feed, salmon eggs, feed additives, or Mediterranean seafood export from VARS.",
  },
  faq: {
    title: "Aquaculture B2B FAQs | VARS Aquaculture",
    description:
      "Answers about aquaculture orders, salmon ova, Artemia, minimum quantities, certification, cold-chain delivery, and export.",
  },
  salmonOva: {
    title: "Salmonid Ova Solutions | Atlantic, Coho & Trout Eggs | VARS",
    description:
      "Certified fertilized salmon and trout eggs with cold-chain logistics for hatcheries and RAS farms.",
  },
  coho: {
    title: "Coho Salmon Eggs | Certified Fertilized Ova | VARS",
    description:
      "Certified Coho salmon eggs for cold-water hatcheries and RAS farms, with documented handling and air-freight logistics.",
  },
  artemiaGuide: {
    title: "Artemia Cysts Hatching & Incubation Guide | VARS",
    description:
      "Practical Artemia hatching guidance covering salinity, pH, temperature, aeration, harvest, and hatchery handling.",
  },
  decapGuide: {
    title: "Standard vs Decapsulated Artemia Cysts | VARS",
    description:
      "Compare shell-on and decapsulated Artemia cysts for hatcheries, aquariums, retailers, and aquaculture farms.",
  },
  horeca: {
    title: "HORECA Seafood Supply in the Middle East | VARS",
    description:
      "B2B supply of Mediterranean fish and shrimp to hotels, restaurants, and catering buyers across the GCC.",
  },
  regionalTrade: {
    title: "Aquaculture Trade Routes: Middle East & Europe | VARS",
    description:
      "Aquaculture live feed, salmon eggs, and seafood export routes from Türkiye to the Middle East and Europe.",
  },
  aquariums: {
    title: "Live Feed for Aquariums, Retailers & Hobbyists | VARS",
    description:
      "Artemia cysts, decapsulated Artemia, and Chlorella microalgae for aquariums, fish breeders, retailers, and hobbyists.",
  },
  privacy: {
    title: "Privacy Policy | VARS Aquaculture",
    description:
      "VARS Aquaculture privacy policy covering personal data, KVKK, GDPR, cookies, and B2B communications.",
  },
  terms: {
    title: "Terms of Service | VARS Aquaculture",
    description:
      "Terms governing VARS Aquaculture website use, B2B quotations, commercial transactions, and online services.",
  },
  login: {
    title: "Sign In | VARS Aquaculture B2B Portal",
    description:
      "Sign in to manage your VARS B2B account, quotations, orders, and shipment documentation.",
  },
  register: {
    title: "Register as a B2B Partner | VARS Aquaculture",
    description:
      "Register your company to request B2B pricing, quotations, aquaculture products, and export services.",
  },
  account: {
    title: "B2B Customer Dashboard | VARS Aquaculture",
    description:
      "Manage B2B orders, shipment documentation, quotations, and company profile in the VARS portal.",
  },
  cart: {
    title: "B2B Quote Cart | VARS Aquaculture",
    description:
      "Review selected aquaculture products and prepare a B2B quotation request for VARS.",
  },
  shop: {
    title: "Aquaculture Store | VARS Aquaculture B2B",
    description:
      "Browse aquaculture feed, hatchery inputs, and Mediterranean seafood products from VARS.",
  },
  checkout: {
    title: "B2B Store Checkout | VARS Aquaculture",
    description: "Complete your VARS aquaculture store order and delivery details.",
  },
};

export function getLocalizedPageMeta(page: SeoPage): PageMeta {
  if (page === "home" || page === "about" || page === "products" || page === "blog") {
    return getSeoMeta(page);
  }
  const lang = getCurrentLocaleForSeo();
  return SEO_COPY[page]?.[lang] ?? localizedGeneric(page, lang);
}

export function getLocalizedMeta(page: SeoPage) {
  const meta = getLocalizedPageMeta(page);
  return [
    { title: meta.title },
    { name: "description", content: meta.description },
    { property: "og:title", content: meta.title },
    { property: "og:description", content: meta.description },
    { name: "twitter:title", content: meta.title },
    { name: "twitter:description", content: meta.description },
  ];
}

function localizedGeneric(page: SeoPage, lang: LangCode): PageMeta {
  const base = GENERIC_SEO[page] ?? getSeoMeta("home");
  const labels: Record<LangCode, string> = {
    en: "",
    tr: " | VARS Aquaculture",
    de: " | VARS Aquaculture",
    ar: " | VARS Aquaculture",
    ru: " | VARS Aquaculture",
    ja: " | VARS Aquaculture",
    ko: " | VARS Aquaculture",
    zh: " | VARS Aquaculture",
    es: " | VARS Aquaculture",
  };
  return { title: `${base.title}${labels[lang]}`, description: base.description };
}

function getCurrentLocaleForSeo(): LangCode {
  if (typeof window !== "undefined") {
    const first = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
    if (first && ["en", "tr", "ar", "de", "ru", "ja", "ko", "zh", "es"].includes(first))
      return first as LangCode;
  }
  const storage = (globalThis as unknown as Record<string, unknown>).serverStorage as
    { getStore: () => { lang?: string } | undefined } | undefined;
  const lang = storage?.getStore()?.lang;
  return lang && ["en", "tr", "ar", "de", "ru", "ja", "ko", "zh", "es"].includes(lang)
    ? (lang as LangCode)
    : "en";
}

const SEO_TRANSLATIONS: Record<string, Record<LangCode, PageMeta>> = {
  home: {
    en: {
      title: "VARS Aquaculture — Premium B2B Aquaculture & Seafood Portal",
      description:
        "Certified salmon eggs, artemia, chlorella, feed additives and Mediterranean seafood — shipped worldwide from Türkiye.",
    },
    tr: {
      title: "VARS Aquaculture — Premium B2B Akvakültür ve Deniz Ürünleri Portalı",
      description:
        "Sertifikalı somon yumurtası, artemia, klorella, yem katkı maddeleri ve Akdeniz deniz ürünleri — Türkiye'den tüm dünyaya sevk edilmektedir.",
    },
    de: {
      title: "VARS Aquaculture — Premium-B2B-Aquakultur- und Meeresfrüchteportal",
      description:
        "Zertifizierte Lachseier, Artemia, Chlorella, Futtermittelzusatzstoffe und Meeresfrüchte aus dem Mittelmeer — weltweit abgewickelt aus der Türkei.",
    },
    ar: {
      title: "VARS Aquaculture — بوابة الاستزراع المائي والمأكولات البحرية الفاخرة للشركات B2B",
      description:
        "بيض السلمون المعتمد، والأرتيميا، والكلوريلا، وإضافات الأعلاف، والمأكولات البحرية المتوسطية — يتم شحنها عالميًا من تركيا.",
    },
    ru: {
      title: "VARS Aquaculture — B2B портал аквакультуры и морепродуктов премиум-класса",
      description:
        "Сертифицированная икра лосося, артемия, хлорелла, кормовые добавки и средиземноморские морепродукты — доставка по всему миру из Турции.",
    },
    ja: {
      title: "VARS Aquaculture — プレミアムB2B養殖・水産物ポータル",
      description:
        "認定サーモン卵、アルテミア、クロレラ、飼料添加物, 地中海産水産物 — トルコから世界中へ配送されます。",
    },
    ko: {
      title: "VARS Aquaculture — 프리미엄 B2B 양식 및 수산물 포털",
      description:
        "인증된 연어 알, 알테미아, 클로렐라, 사료 첨가제 및 지중해 수산물 — 터키에서 전 세계로 발송됩니다.",
    },
    zh: {
      title: "VARS Aquaculture — 优质B2B水产养殖与海鲜出口门户",
      description:
        "经认证的鲑鱼发眼卵、丰年虫卵、小球藻、饲料添加物及地中海新鲜海鲜出口 — 从土耳其销往全球。",
    },
    es: {
      title: "VARS Aquaculture — Portal premium de acuicultura y marisco B2B",
      description:
        "Ovas de salmón certificadas, artemia, chlorella, aditivos para piensos y marisco mediterráneo — exportación global desde Turquía.",
    },
  },
  about: {
    en: {
      title: "About Us | VARS Aquaculture",
      description:
        "Learn about VARS Aquaculture's heritage in hatcheries sourcing, biosecurity protocols, and global client supply chain.",
    },
    tr: {
      title: "Hakkımızda | VARS Aquaculture",
      description:
        "VARS Aquaculture'ın kuluçkahane tedariği, biyogüvenlik protokolleri ve küresel müşteri tedarik zincirindeki mirasını öğrenin.",
    },
    de: {
      title: "Über uns | VARS Aquaculture",
      description:
        "Erfahren Sie mehr über das Erbe von VARS Aquaculture bei der Belieferung von Brutanlagen, Biosicherheitsprotokollen und der globalen Lieferkette.",
    },
    ar: {
      title: "من نحن | VARS Aquaculture",
      description:
        "تعرف على تاريخ VARS Aquaculture في توريد المفرخات، وبروتوكولات الأمن الحيوي، وسلسلة توريد العملاء العالمية.",
    },
    ru: {
      title: "О нас | VARS Aquaculture",
      description:
        "Узнайте об истории VARS Aquaculture в области снабжения инкубаторов, протоколах биобезопасности и глобальной цепочке поставок.",
    },
    ja: {
      title: "会社概要 | VARS Aquaculture",
      description:
        "孵化場への供給、バイオセキュリティプロトコル、グローバルなサプライチェーンにおけるVARS Aquacultureの実績について詳しく紹介します。",
    },
    ko: {
      title: "회사 소개 | VARS Aquaculture",
      description:
        "부화장 공급, 바이오보안 프로토콜, 그리고 글로벌 고객 공급망에서 VARS Aquaculture의 발자취에 대해 알아보세요.",
    },
    zh: {
      title: "关于我们 | VARS Aquaculture",
      description:
        "了解 VARS Aquaculture 在孵化场供给、生物安全协议以及全球客户供应链方面的历史累积。",
    },
    es: {
      title: "Quiénes somos | VARS Aquaculture",
      description:
        "Conozca la experiencia de VARS Aquaculture en el suministro de criaderos, protocolos de bioseguridad y cadena de suministro global.",
    },
  },
  products: {
    en: {
      title: "Product Catalog | VARS Aquaculture",
      description:
        "Explore our certified range of live feed, salmon eyed eggs, microalgae, feed additives, and fresh Mediterranean fish export.",
    },
    tr: {
      title: "Ürün Kataloğu | VARS Aquaculture",
      description:
        "Sertifikalı canlı yem, somon yumurtası, mikroalgler, yem katkı maddeleri ve taze Akdeniz balığı ihracatı ürün grubumuzu inceleyin.",
    },
    de: {
      title: "Produktkatalog | VARS Aquaculture",
      description:
        "Entdecken Sie unser zertifiziertes Angebot an Lebendfutter, Lachseiern, Mikroalgen, Futtermittelzusatzstoffen und frischem Fisch aus dem Mittelmeer.",
    },
    ar: {
      title: "كتالوج المنتجات | VARS Aquaculture",
      description:
        "استكشف مجموعتنا المعتمدة من الأعلاف الحية، وبيض السلمون، والطحالب الدقيقة، وإضافات الأعلاف، وتصدير الأسماك المتوسطية الطازجة.",
    },
    ru: {
      title: "Каталог продукции | VARS Aquaculture",
      description:
        "Изучите наш сертифицированный ассортимент живых кормов, икры лосося, микроводорослей, кормовых добавках и экспорте свежей рыбы.",
    },
    ja: {
      title: "製品カタログ | VARS Aquaculture",
      description:
        "認定生餌、サーモン卵、微細藻類、飼料添加物、新鮮な地中海産魚類輸出など、実績ある製品ラインナップをご覧ください。",
    },
    ko: {
      title: "제품 카탈로그 | VARS Aquaculture",
      description:
        "생알테미아, 연어 알, 미세조류, 사료 첨가제 및 신선한 지중해 어류 수출 등 당사의 인증된 제품 포트폴리오를 확인해 보세요.",
    },
    zh: {
      title: "产品目录 | VARS Aquaculture",
      description:
        "探索我们经认证的鲜活饵料、鲑鱼发眼卵、微藻、饲料添加剂和地中海新鲜鱼类出口产品系列。",
    },
    es: {
      title: "Catálogo de productos | VARS Aquaculture",
      description:
        "Explore nuestra gama certificada de alimento vivo, ovas de salmón con ojos, microalgas, aditivos para piensos y pescado fresco del Mediterráneo.",
    },
  },
  blog: {
    en: {
      title: "Aqua MAG — Technical Journal & Articles | VARS",
      description:
        "Authoritative reviews on hatchery engineering, live feed nutrition, rotifer culture, and aquaculture biosecurity.",
    },
    tr: {
      title: "Aqua MAG — Teknik Yayınlar ve Makaleler | VARS",
      description:
        "Kuluçkahane mühendisliği, canlı yem besleme, rotifer kültürü ve akvakültür biyogüvenliği üzerine güvenilir teknik incelemeler.",
    },
    de: {
      title: "Aqua MAG — Technische Fachzeitschrift & Artikel | VARS",
      description:
        "Autoritative Berichte über Bruthaustechnik, Lebendfutternährstoffe, Rädertierchenzucht und Aquakultur-Biosicherheit.",
    },
    ar: {
      title: "Aqua MAG — المجلة التقنية والمقالات | VARS",
      description:
        "مراجعات موثوقة حول هندسة المفرخات، وتغذية الأعلاف الحية، واستزراع الروتيفير، والأمن الحيوي للاستزراع المائي.",
    },
    ru: {
      title: "Aqua MAG — Технический журнал и статьи | VARS",
      description:
        "Авторитетные обзоры по инкубационному инжинирингу, питанию живых кормов, культивированию коловраток и биобезопасности.",
    },
    ja: {
      title: "Aqua MAG — 技術ジャーナル＆記事 | VARS",
      description:
        "孵化場エンジニアリング、生餌의 영양、ワムシ培養、養殖バイオセキュリティに関する信頼のおける解説記事。",
    },
    ko: {
      title: "Aqua MAG — 기술 저널 및 기사 | VARS",
      description:
        "부화장 엔지니어링, 생알테미아 영양, 로티퍼 배양 및 양식 바이오보안에 관한 신뢰도 높은 기술 저널 자료집.",
    },
    zh: {
      title: "Aqua MAG — 技术期刊与文章 | VARS",
      description: "关于育苗工程、鲜活饵料营养、轮虫培养和水产养殖生物安全的权威文章技术期刊。",
    },
    es: {
      title: "Aqua MAG — Revista técnica y artículos | VARS",
      description:
        "Revisiones autorizadas sobre ingeniería de criaderos, nutrición de alimento vivo, cultivo de rotíferos y bioseguridad en acuicultura.",
    },
  },
};

export function getSeoMeta(page: "home" | "about" | "products" | "blog"): PageMeta {
  let lang: LangCode = "en";
  if (typeof window !== "undefined") {
    const parts = window.location.pathname.split("/").filter(Boolean);
    if (parts.length > 0) {
      const first = parts[0].toLowerCase();
      const validLangs: LangCode[] = ["tr", "ar", "de", "ru", "ja", "ko", "en", "zh", "es"];
      if (validLangs.includes(first as LangCode)) {
        lang = first as LangCode;
      }
    }
  } else {
    const storage = (globalThis as unknown as Record<string, unknown>).serverStorage as
      { getStore: () => { lang?: string } | undefined } | undefined;
    const store = storage?.getStore();
    if (store?.lang) {
      lang = store.lang as LangCode;
    }
  }
  return SEO_TRANSLATIONS[page]?.[lang] || SEO_TRANSLATIONS[page]["en"];
}
