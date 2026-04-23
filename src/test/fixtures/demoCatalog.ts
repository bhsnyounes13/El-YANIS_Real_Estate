import type { Agent, Property, ServiceItem } from "@/lib/domain/types";

/** Données de démo **uniquement pour les tests Vitest** (mock fetch). Ne pas importer depuis l’app produit. */
export const demoAgents: Agent[] = [
  {
    id: "a1",
    name: "Yanis Benmoussa",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    phone: "+213 555 123 456",
    email: "yanis@elyainis.com",
    bio_en: "Senior real estate consultant with 10+ years of experience in western Algeria.",
    bio_fr: "Consultant immobilier senior avec plus de 10 ans d'expérience dans l'ouest algérien.",
    bio_ar: "مستشار عقاري أول بخبرة تزيد عن 10 سنوات في غرب الجزائر.",
  },
  {
    id: "a2",
    name: "Amina Khelifi",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    phone: "+213 555 789 012",
    email: "amina@elyainis.com",
    bio_en: "Specialist in luxury residential properties and commercial spaces.",
    bio_fr: "Spécialiste des propriétés résidentielles de luxe et des espaces commerciaux.",
    bio_ar: "متخصصة في العقارات السكنية الفاخرة والمساحات التجارية.",
  },
];

export const demoProperties: Property[] = [
  {
    id: "1",
    title_en: "Modern Villa with Garden",
    title_fr: "Villa Moderne avec Jardin",
    title_ar: "فيلا عصرية مع حديقة",
    description_en:
      "A stunning modern villa featuring spacious rooms, a beautiful garden, and panoramic views of Tlemcen. The property includes high-end finishes, marble floors, and a fully equipped kitchen.",
    description_fr:
      "Une superbe villa moderne avec des pièces spacieuses, un beau jardin et des vues panoramiques sur Tlemcen. La propriété comprend des finitions haut de gamme, des sols en marbre et une cuisine entièrement équipée.",
    description_ar:
      "فيلا عصرية مذهلة تتميز بغرف واسعة وحديقة جميلة وإطلالات بانورامية على تلمسان. تشمل العقار تشطيبات راقية وأرضيات رخامية ومطبخ مجهز بالكامل.",
    type: "sale",
    price: 45000000,
    city: "tlemcen",
    bedrooms: 5,
    bathrooms: 3,
    area: 350,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=500&fit=crop",
    ],
    amenities: [
      "Swimming Pool",
      "Garden",
      "Garage",
      "Central Heating",
      "Security System",
      "Terrace",
    ],
    agent_id: "a1",
    featured: true,
    tags: ["featured"],
  },
  {
    id: "2",
    title_en: "Luxury Apartment Downtown",
    title_fr: "Appartement de Luxe Centre-Ville",
    title_ar: "شقة فاخرة وسط المدينة",
    description_en:
      "Elegant apartment in the heart of Ain Temouchent with modern amenities and city views. Features an open-plan living area, designer kitchen, and premium bathroom fittings.",
    description_fr:
      "Appartement élégant au cœur d'Ain Temouchent avec des équipements modernes et des vues sur la ville. Dispose d'un salon ouvert, d'une cuisine design et d'une salle de bain haut de gamme.",
    description_ar:
      "شقة أنيقة في قلب عين تموشنت مع مرافق حديثة وإطلالات على المدينة. تتميز بمنطقة معيشة مفتوحة ومطبخ مصمم وتجهيزات حمام فاخرة.",
    type: "sale",
    price: 18000000,
    city: "ainTemouchent",
    bedrooms: 3,
    bathrooms: 2,
    area: 140,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=500&fit=crop",
    ],
    amenities: ["Elevator", "Parking", "Air Conditioning", "Balcony", "Intercom"],
    agent_id: "a2",
    featured: true,
    tags: ["new"],
  },
  {
    id: "3",
    title_en: "Cozy Family Home",
    title_fr: "Maison Familiale Chaleureuse",
    title_ar: "منزل عائلي دافئ",
    description_en:
      "A charming family home in a quiet neighborhood of Sidi Bel Abbès. Perfect for families looking for comfort and tranquility with easy access to schools and amenities.",
    description_fr:
      "Une charmante maison familiale dans un quartier calme de Sidi Bel Abbès. Parfaite pour les familles recherchant confort et tranquillité avec un accès facile aux écoles et commodités.",
    description_ar:
      "منزل عائلي ساحر في حي هادئ في سيدي بلعباس. مثالي للعائلات التي تبحث عن الراحة والهدوء مع سهولة الوصول إلى المدارس والمرافق.",
    type: "sale",
    price: 25000000,
    city: "sidiBelAbbes",
    bedrooms: 4,
    bathrooms: 2,
    area: 220,
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=500&fit=crop",
    ],
    amenities: ["Garden", "Garage", "Storage Room", "Central Heating", "Fireplace"],
    agent_id: "a1",
    featured: true,
  },
  {
    id: "4",
    title_en: "Penthouse with Sea View",
    title_fr: "Penthouse avec Vue sur Mer",
    title_ar: "بنتهاوس مع إطلالة بحرية",
    description_en:
      "Breathtaking penthouse apartment with panoramic Mediterranean sea views in Ain Temouchent. Features a rooftop terrace, modern design, and premium finishing throughout.",
    description_fr:
      "Spectaculaire penthouse avec vues panoramiques sur la Méditerranée à Ain Temouchent. Dispose d'une terrasse sur le toit, d'un design moderne et de finitions premium.",
    description_ar:
      "بنتهاوس مذهل مع إطلالات بانورامية على البحر المتوسط في عين تموشنت. يتميز بتراس على السطح وتصميم عصري وتشطيبات فاخرة.",
    type: "rent",
    price: 120000,
    city: "ainTemouchent",
    bedrooms: 2,
    bathrooms: 1,
    area: 95,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=500&fit=crop",
    ],
    amenities: ["Sea View", "Terrace", "Air Conditioning", "Elevator", "Furnished"],
    agent_id: "a2",
    featured: true,
    tags: ["exclusive"],
    bookedDates: [
      { from: "2026-04-15", to: "2026-04-30" },
      { from: "2026-05-10", to: "2026-05-25" },
      { from: "2026-06-01", to: "2026-06-15" },
    ],
  },
  {
    id: "5",
    title_en: "Traditional Riad Style Home",
    title_fr: "Maison de Style Riad Traditionnel",
    title_ar: "منزل بطراز رياض تقليدي",
    description_en:
      "A beautifully restored traditional home in the historic medina of Tlemcen. Combines authentic Algerian architecture with modern comforts. Features a central courtyard with fountain.",
    description_fr:
      "Une magnifique maison traditionnelle restaurée dans la médina historique de Tlemcen. Combine l'architecture algérienne authentique avec le confort moderne. Dispose d'une cour centrale avec fontaine.",
    description_ar:
      "منزل تقليدي مرمم بشكل جميل في المدينة القديمة التاريخية بتلمسان. يجمع بين العمارة الجزائرية الأصيلة والراحة الحديثة. يتميز بفناء مركزي مع نافورة.",
    type: "sale",
    price: 35000000,
    city: "tlemcen",
    bedrooms: 6,
    bathrooms: 3,
    area: 400,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&h=500&fit=crop",
    ],
    amenities: [
      "Courtyard",
      "Fountain",
      "Rooftop Terrace",
      "Traditional Tiles",
      "Central Heating",
      "Storage",
    ],
    agent_id: "a1",
    featured: true,
    tags: ["exclusive"],
  },
  {
    id: "6",
    title_en: "Studio Apartment for Rent",
    title_fr: "Studio à Louer",
    title_ar: "شقة استوديو للإيجار",
    description_en:
      "Modern studio apartment ideal for students or young professionals in Sidi Bel Abbès. Fully furnished with a compact but well-designed living space.",
    description_fr:
      "Studio moderne idéal pour étudiants ou jeunes professionnels à Sidi Bel Abbès. Entièrement meublé avec un espace de vie compact mais bien conçu.",
    description_ar:
      "شقة استوديو عصرية مثالية للطلاب أو المهنيين الشباب في سيدي بلعباس. مفروشة بالكامل مع مساحة معيشة مدمجة ولكن مصممة بشكل جيد.",
    type: "rent",
    price: 35000,
    city: "sidiBelAbbes",
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&h=500&fit=crop",
    ],
    amenities: ["Furnished", "Air Conditioning", "Internet", "Washing Machine"],
    agent_id: "a2",
    featured: true,
    tags: ["new"],
    bookedDates: [
      { from: "2026-04-20", to: "2026-05-05" },
      { from: "2026-05-15", to: "2026-05-31" },
    ],
  },
];

export const demoServicesCatalog: ServiceItem[] = [
  {
    id: "s1",
    iconKey: "building",
    title_en: "Property Sales",
    title_fr: "Vente Immobilière",
    title_ar: "بيع العقارات",
    description_en:
      "We help you sell your property at the best market value with professional marketing, photography, and negotiation support.",
    description_fr:
      "Nous vous aidons à vendre votre propriété au meilleur prix du marché avec un marketing professionnel, des photos et un soutien à la négociation.",
    description_ar:
      "نساعدك في بيع عقارك بأفضل قيمة سوقية مع التسويق الاحترافي والتصوير ودعم التفاوض.",
  },
  {
    id: "s2",
    iconKey: "trending",
    title_en: "Property Investment",
    title_fr: "Investissement Immobilier",
    title_ar: "الاستثمار العقاري",
    description_en:
      "Expert guidance on real estate investment opportunities across western Algeria with detailed market analysis and ROI projections.",
    description_fr:
      "Conseils d'experts sur les opportunités d'investissement immobilier dans l'ouest algérien avec des analyses de marché détaillées.",
    description_ar: "إرشادات خبيرة حول فرص الاستثمار العقاري في غرب الجزائر مع تحليل مفصل للسوق.",
  },
  {
    id: "s3",
    iconKey: "handshake",
    title_en: "Property Rental",
    title_fr: "Location Immobilière",
    title_ar: "تأجير العقارات",
    description_en:
      "Find the perfect rental property or list your property for rent with our comprehensive tenant screening and management services.",
    description_fr:
      "Trouvez la propriété locative idéale ou mettez votre bien en location avec nos services complets de sélection et de gestion des locataires.",
    description_ar:
      "اعثر على العقار المثالي للإيجار أو اعرض عقارك للإيجار مع خدمات فحص وإدارة المستأجرين الشاملة.",
  },
  {
    id: "s4",
    iconKey: "file",
    title_en: "Legal Assistance",
    title_fr: "Assistance Juridique",
    title_ar: "المساعدة القانونية",
    description_en:
      "Navigate the legal complexities of real estate transactions with our experienced legal team handling contracts, permits, and documentation.",
    description_fr:
      "Naviguez dans les complexités juridiques des transactions immobilières avec notre équipe juridique expérimentée.",
    description_ar: "تعامل مع التعقيدات القانونية للمعاملات العقارية مع فريقنا القانوني ذو الخبرة.",
  },
  {
    id: "s5",
    iconKey: "scale",
    title_en: "Property Valuation",
    title_fr: "Évaluation Immobilière",
    title_ar: "تقييم العقارات",
    description_en:
      "Accurate property valuation services using advanced market data analysis and professional assessment methodologies.",
    description_fr:
      "Services d'évaluation immobilière précis utilisant l'analyse avancée des données du marché et des méthodologies d'évaluation professionnelles.",
    description_ar:
      "خدمات تقييم عقاري دقيقة باستخدام تحليل بيانات السوق المتقدم ومنهجيات التقييم المهنية.",
  },
  {
    id: "s6",
    iconKey: "paint",
    title_en: "Interior Design",
    title_fr: "Design d'Intérieur",
    title_ar: "التصميم الداخلي",
    description_en:
      "Transform your property with our interior design consultation services, creating spaces that reflect your style and maximize value.",
    description_fr:
      "Transformez votre propriété avec nos services de consultation en design d'intérieur, créant des espaces qui reflètent votre style.",
    description_ar:
      "حوّل عقارك مع خدمات استشارات التصميم الداخلي، لإنشاء مساحات تعكس أسلوبك وتزيد القيمة.",
  },
];
