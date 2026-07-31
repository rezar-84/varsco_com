import { LangCode } from "@/lib/types";

export interface PageMeta {
  title: string;
  description: string;
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
      description:
        "关于育苗工程、鲜活饵料营养、轮虫培养和水产养殖生物安全的权威文章技术期刊。",
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
