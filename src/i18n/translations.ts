export type Language = "en" | "fr" | "ar";

const translations: Record<string, Record<Language, string>> = {
  // Navbar
  "nav.home": { en: "Home", fr: "Accueil", ar: "الرئيسية" },
  "nav.listings": { en: "Listings", fr: "Annonces", ar: "العقارات" },
  "nav.services": { en: "Services", fr: "Services", ar: "الخدمات" },
  "nav.agents": { en: "Agents", fr: "Agents", ar: "الوكلاء" },
  "nav.about": { en: "About", fr: "À propos", ar: "حولنا" },
  "nav.contact": { en: "Contact", fr: "Contact", ar: "اتصل بنا" },

  // Hero
  "hero.title": {
    en: "Find Your Dream Property in Algeria",
    fr: "Trouvez Votre Propriété de Rêve en Algérie",
    ar: "اعثر على عقار أحلامك في الجزائر",
  },
  "hero.subtitle": {
    en: "Premium real estate in Tlemcen, Ain Temouchent & Sidi Bel Abbès",
    fr: "Immobilier haut de gamme à Tlemcen, Ain Temouchent & Sidi Bel Abbès",
    ar: "عقارات فاخرة في تلمسان، عين تموشنت وسيدي بلعباس",
  },
  "hero.search": {
    en: "Search properties...",
    fr: "Rechercher des propriétés...",
    ar: "ابحث عن عقارات...",
  },
  "hero.searchBtn": { en: "Search", fr: "Rechercher", ar: "بحث" },

  // Property types
  "type.all": { en: "All Types", fr: "Tous types", ar: "جميع الأنواع" },
  "type.sale": { en: "For Sale", fr: "À vendre", ar: "للبيع" },
  "type.rent": { en: "For Rent", fr: "À louer", ar: "للإيجار" },

  // Cities
  "city.all": { en: "All Cities", fr: "Toutes les villes", ar: "جميع المدن" },
  "city.tlemcen": { en: "Tlemcen", fr: "Tlemcen", ar: "تلمسان" },
  "city.ainTemouchent": { en: "Ain Temouchent", fr: "Ain Temouchent", ar: "عين تموشنت" },
  "city.sidiBelAbbes": { en: "Sidi Bel Abbès", fr: "Sidi Bel Abbès", ar: "سيدي بلعباس" },

  // Features
  "features.premium.title": {
    en: "Premium Properties",
    fr: "Propriétés Premium",
    ar: "عقارات فاخرة",
  },
  "features.premium.desc": {
    en: "Handpicked luxury properties across western Algeria",
    fr: "Propriétés de luxe triées sur le volet dans l'ouest algérien",
    ar: "عقارات فاخرة مختارة بعناية في غرب الجزائر",
  },
  "features.agents.title": { en: "Expert Agents", fr: "Agents Experts", ar: "وكلاء خبراء" },
  "features.agents.desc": {
    en: "Professional guidance through every step of your journey",
    fr: "Un accompagnement professionnel à chaque étape",
    ar: "إرشاد مهني في كل خطوة من رحلتك",
  },
  "features.trusted.title": {
    en: "Trusted Service",
    fr: "Service de Confiance",
    ar: "خدمة موثوقة",
  },
  "features.trusted.desc": {
    en: "Years of experience serving the Algerian real estate market",
    fr: "Des années d'expérience au service du marché immobilier algérien",
    ar: "سنوات من الخبرة في خدمة سوق العقارات الجزائري",
  },

  // Homepage
  "home.heroEyebrow": { en: "Luminous estates", fr: "Estates lumineux", ar: "عقارات مشرقة" },
  "home.spotlight": { en: "Spotlight residence", fr: "Résidence phare", ar: "إقامة مميزة" },
  "home.featured": { en: "Featured Properties", fr: "Propriétés en Vedette", ar: "عقارات مميزة" },
  "home.featuredEyebrow": { en: "Collection", fr: "Collection", ar: "مجموعة" },
  "home.featuredSubtitle": {
    en: "Editorially curated homes across our western corridor.",
    fr: "Des résidences sélectionnées avec exigence sur notre couloir ouest.",
    ar: "منازل مختارة بعناية على ممرنا الغربي.",
  },
  "home.viewAll": {
    en: "View All Properties",
    fr: "Voir Toutes les Propriétés",
    ar: "عرض جميع العقارات",
  },
  "home.whyEyebrow": { en: "Approach", fr: "Approche", ar: "النهج" },
  "home.whyTitle": { en: "Quiet expertise", fr: "Une expertise silencieuse", ar: "خبرة هادئة" },
  "home.whySubtitle": {
    en: "Structured counsel, luminous presentation, zero noise.",
    fr: "Conseil structuré, présentation lumineuse, zéro bruit.",
    ar: "استشارة منظمة، عرض مشرق، بلا ضجيج.",
  },
  "home.citiesEyebrow": { en: "Territories", fr: "Territoires", ar: "المناطق" },
  "home.citiesTitle": {
    en: "Three anchor cities",
    fr: "Trois villes pivots",
    ar: "ثلاث مدن محورية",
  },
  "home.citiesSubtitle": {
    en: "Move between Tlemcen, Ain Temouchent, and Sidi Bel Abbès with one consistent standard.",
    fr: "Circulez entre Tlemcen, Ain Temouchent et Sidi Bel Abbès avec un même standard.",
    ar: "تنقّل بين تلمسان وعين تموشنت وسيدي بلعباس بذات المستوى.",
  },
  "home.ctaTitle": {
    en: "Ready for a composed acquisition?",
    fr: "Prêt pour une acquisition maîtrisée ?",
    ar: "مستعد لعملية شراء مدروسة؟",
  },
  "home.ctaSubtitle": {
    en: "Our studio replies within one business day.",
    fr: "Notre studio répond sous un jour ouvré.",
    ar: "نجيب خلال يوم عمل واحد.",
  },

  // Listings
  "listings.title": { en: "Property Listings", fr: "Annonces Immobilières", ar: "قائمة العقارات" },
  "listings.filters": { en: "Filters", fr: "Filtres", ar: "التصفية" },
  "listings.price": { en: "Price Range", fr: "Fourchette de Prix", ar: "نطاق السعر" },
  "listings.priceMin": { en: "Min Price", fr: "Prix Min", ar: "السعر الأدنى" },
  "listings.priceMax": { en: "Max Price", fr: "Prix Max", ar: "السعر الأقصى" },
  "listings.bedrooms": { en: "Bedrooms", fr: "Chambres", ar: "غرف النوم" },
  "listings.bathrooms": { en: "Bathrooms", fr: "Salles de bain", ar: "الحمامات" },
  "listings.any": { en: "Any", fr: "Tous", ar: "الكل" },
  "listings.clear": { en: "Clear Filters", fr: "Effacer les filtres", ar: "مسح التصفية" },
  "listings.noResults": {
    en: "No properties found",
    fr: "Aucune propriété trouvée",
    ar: "لم يتم العثور على عقارات",
  },
  "listings.showFilters": { en: "Show Filters", fr: "Afficher les filtres", ar: "عرض التصفية" },
  "listings.heroEyebrow": { en: "Catalogue", fr: "Catalogue", ar: "الكتالوج" },
  "listings.heroDesc": {
    en: "Browse with filters that stay in sync with the URL.",
    fr: "Parcourez avec des filtres synchronisés à l’URL.",
    ar: "تصفح مع مرشحات متزامنة مع الرابط.",
  },
  "listings.apply": { en: "Apply filters", fr: "Appliquer", ar: "تطبيق" },
  "listings.noResultsHint": {
    en: "Adjust keywords or price to widen the set.",
    fr: "Ajustez mots-clés ou prix pour élargir la sélection.",
    ar: "عدّل الكلمات أو السعر لتوسيع النتائج.",
  },

  // Property detail
  "detail.back": { en: "Back to Listings", fr: "Retour aux Annonces", ar: "العودة إلى القائمة" },
  "detail.description": { en: "Description", fr: "Description", ar: "الوصف" },
  "detail.amenities": { en: "Amenities", fr: "Équipements", ar: "المرافق" },
  "detail.contactAgent": { en: "Contact Agent", fr: "Contacter l'Agent", ar: "اتصل بالوكيل" },
  "detail.inquiry": { en: "Send Inquiry", fr: "Envoyer une Demande", ar: "إرسال استفسار" },
  "detail.name": { en: "Your Name", fr: "Votre Nom", ar: "اسمك" },
  "detail.email": { en: "Your Email", fr: "Votre Email", ar: "بريدك الإلكتروني" },
  "detail.phone": { en: "Your Phone", fr: "Votre Téléphone", ar: "هاتفك" },
  "detail.message": { en: "Message", fr: "Message", ar: "الرسالة" },
  "detail.send": { en: "Send Message", fr: "Envoyer le Message", ar: "إرسال الرسالة" },
  "detail.notFound": {
    en: "Property not found",
    fr: "Propriété introuvable",
    ar: "العقار غير موجود",
  },
  "detail.availability": { en: "Availability", fr: "Disponibilité", ar: "التوفر" },
  "detail.dateBooked": {
    en: "This date is booked",
    fr: "Cette date est réservée",
    ar: "هذا التاريخ محجوز",
  },
  "detail.dateFree": {
    en: "This date is available",
    fr: "Cette date est disponible",
    ar: "هذا التاريخ متاح",
  },

  // Property card
  "property.beds": { en: "Beds", fr: "Ch.", ar: "غرف" },
  "property.baths": { en: "Baths", fr: "SdB", ar: "حمام" },
  "property.area": { en: "m²", fr: "m²", ar: "م²" },
  "property.dzd": { en: "DZD", fr: "DZD", ar: "د.ج" },
  "property.cardKeySpecs": {
    en: "Key characteristics:",
    fr: "CARACTÉRISTIQUE CLÉ :",
    ar: "الخصائص الرئيسية:",
  },
  "property.cardSurface": { en: "Area", fr: "Superficie", ar: "المساحة" },
  "property.cardMoreInfo": {
    en: "For more info:",
    fr: "Pour plus d'info :",
    ar: "لمزيد من المعلومات:",
  },
  "property.cardBrand": { en: "EL-YANIS", fr: "EL-YANIS", ar: "EL-YANIS" },
  "property.cardPerMonth": { en: "/mo", fr: "/mois", ar: "/شهر" },

  // Footer
  "footer.brand": { en: "EL-YANIS Real Estate", fr: "EL-YANIS Immobilier", ar: "العنيس للعقارات" },
  "footer.desc": {
    en: "Your trusted partner for premium real estate in western Algeria.",
    fr: "Votre partenaire de confiance pour l'immobilier haut de gamme dans l'ouest algérien.",
    ar: "شريكك الموثوق للعقارات الفاخرة في غرب الجزائر.",
  },
  "footer.links": { en: "Quick Links", fr: "Liens Rapides", ar: "روابط سريعة" },
  "footer.contactTitle": { en: "Contact Us", fr: "Contactez-nous", ar: "اتصل بنا" },
  "footer.rights": {
    en: "All rights reserved.",
    fr: "Tous droits réservés.",
    ar: "جميع الحقوق محفوظة.",
  },

  // Contact page
  "contact.heroEyebrow": { en: "Studio", fr: "Studio", ar: "الاستوديو" },
  "contact.heroTitle": { en: "Write to EL-YANIS", fr: "Écrire à EL-YANIS", ar: "راسل العنيس" },
  "contact.heroDesc": {
    en: "A concise note is enough — we respond with a clear next step.",
    fr: "Une note concise suffit — nous répondons avec la prochaine étape.",
    ar: "ملاحظة موجزة تكفي — نرد بخطوة واضحة.",
  },
  "contact.formTitle": { en: "Project brief", fr: "Brief projet", ar: "ملخص المشروع" },
  "contact.subject": { en: "Subject", fr: "Sujet", ar: "الموضوع" },
  "contact.submit": { en: "Send", fr: "Envoyer", ar: "إرسال" },
  "contact.whatsappTitle": {
    en: "Prefer WhatsApp?",
    fr: "Préférez WhatsApp ?",
    ar: "تفضّل واتساب؟",
  },
  "contact.whatsappDesc": {
    en: "Message us for a fast reply on the ground.",
    fr: "Écrivez-nous pour une réponse rapide sur le terrain.",
    ar: "راسلنا للحصول على رد سريع.",
  },
  "contact.whatsappCta": { en: "Open WhatsApp", fr: "Ouvrir WhatsApp", ar: "افتح واتساب" },

  // Toasts
  "toast.inquirySent": { en: "Inquiry sent", fr: "Demande envoyée", ar: "تم الإرسال" },
  "toast.inquirySentDesc": {
    en: "An advisor will reply shortly.",
    fr: "Un conseiller vous répondra rapidement.",
    ar: "سيتواصل معك مستشار قريباً.",
  },
  "toast.contactSent": { en: "Message sent", fr: "Message envoyé", ar: "تم الإرسال" },
  "toast.contactSentDesc": {
    en: "Thank you — we will be in touch.",
    fr: "Merci — nous revenons vers vous.",
    ar: "شكراً — سنعود إليك.",
  },
  "toast.error": { en: "Something went wrong", fr: "Une erreur est survenue", ar: "حدث خطأ" },
  "toast.errorDesc": {
    en: "The server rejected the request. Try again or contact support.",
    fr: "Le serveur a refusé la demande. Réessayez ou contactez le support.",
    ar: "رفض الخادم الطلب. حاول مجدداً أو تواصل مع الدعم.",
  },

  "security.completeCaptcha": {
    en: "Complete the security check above.",
    fr: "Complétez la vérification de sécurité ci-dessus.",
    ar: "أكمل التحقق الأمني أعلاه.",
  },

  // Not found
  "notfound.label": { en: "Missing page", fr: "Page manquante", ar: "صفحة غير موجودة" },
  "notfound.message": {
    en: "The address may have moved. Choose a destination below.",
    fr: "L’adresse a peut-être changé. Choisissez une destination ci-dessous.",
    ar: "قد يكون العنوان تغيّر. اختر وجهة أدناه.",
  },
  "notfound.home": { en: "Home", fr: "Accueil", ar: "الرئيسية" },
  "notfound.listings": { en: "Listings", fr: "Annonces", ar: "العقارات" },

  // Common
  "common.loading": { en: "Loading...", fr: "Chargement...", ar: "جاري التحميل..." },
  "common.retry": { en: "Try again", fr: "Réessayer", ar: "إعادة المحاولة" },
  "api.loadFailed": {
    en: "Could not load data. Check your connection and try again.",
    fr: "Impossible de charger les données. Vérifiez votre connexion et réessayez.",
    ar: "تعذّر تحميل البيانات. تحقق من الاتصال وحاول مجدداً.",
  },
  "api.backendUnreachable": {
    en: "Cannot reach the API (port 3001). Start the backend (npm run dev:api or dev:full), ensure DATABASE_URL and JWT_ACCESS_SECRET are set in .env (see .env.example), and that PostgreSQL is running.",
    fr: "Impossible de joindre l’API (port 3001). Lancez le backend (npm run dev:api ou dev:full), vérifiez DATABASE_URL et JWT_ACCESS_SECRET dans .env (voir .env.example), et que PostgreSQL tourne.",
    ar: "تعذّر الوصول إلى واجهة API (المنفذ 3001). شغّل الخادم الخلفي (npm run dev:api أو dev:full)، وتأكد من DATABASE_URL وJWT_ACCESS_SECRET في .env (انظر .env.example)، وأن PostgreSQL يعمل.",
  },
};

export default translations;
