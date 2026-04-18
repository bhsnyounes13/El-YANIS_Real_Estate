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
  "hero.title": { en: "Find Your Dream Property in Algeria", fr: "Trouvez Votre Propriété de Rêve en Algérie", ar: "اعثر على عقار أحلامك في الجزائر" },
  "hero.subtitle": { en: "Premium real estate in Tlemcen, Ain Temouchent & Sidi Bel Abbès", fr: "Immobilier haut de gamme à Tlemcen, Ain Temouchent & Sidi Bel Abbès", ar: "عقارات فاخرة في تلمسان، عين تموشنت وسيدي بلعباس" },
  "hero.search": { en: "Search properties...", fr: "Rechercher des propriétés...", ar: "ابحث عن عقارات..." },
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
  "features.premium.title": { en: "Premium Properties", fr: "Propriétés Premium", ar: "عقارات فاخرة" },
  "features.premium.desc": { en: "Handpicked luxury properties across western Algeria", fr: "Propriétés de luxe triées sur le volet dans l'ouest algérien", ar: "عقارات فاخرة مختارة بعناية في غرب الجزائر" },
  "features.agents.title": { en: "Expert Agents", fr: "Agents Experts", ar: "وكلاء خبراء" },
  "features.agents.desc": { en: "Professional guidance through every step of your journey", fr: "Un accompagnement professionnel à chaque étape", ar: "إرشاد مهني في كل خطوة من رحلتك" },
  "features.trusted.title": { en: "Trusted Service", fr: "Service de Confiance", ar: "خدمة موثوقة" },
  "features.trusted.desc": { en: "Years of experience serving the Algerian real estate market", fr: "Des années d'expérience au service du marché immobilier algérien", ar: "سنوات من الخبرة في خدمة سوق العقارات الجزائري" },

  // Homepage
  "home.featured": { en: "Featured Properties", fr: "Propriétés en Vedette", ar: "عقارات مميزة" },
  "home.viewAll": { en: "View All Properties", fr: "Voir Toutes les Propriétés", ar: "عرض جميع العقارات" },

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
  "listings.noResults": { en: "No properties found", fr: "Aucune propriété trouvée", ar: "لم يتم العثور على عقارات" },
  "listings.showFilters": { en: "Show Filters", fr: "Afficher les filtres", ar: "عرض التصفية" },

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
  "detail.notFound": { en: "Property not found", fr: "Propriété introuvable", ar: "العقار غير موجود" },

  // Property card
  "property.beds": { en: "Beds", fr: "Ch.", ar: "غرف" },
  "property.baths": { en: "Baths", fr: "SdB", ar: "حمام" },
  "property.area": { en: "m²", fr: "m²", ar: "م²" },
  "property.dzd": { en: "DZD", fr: "DZD", ar: "د.ج" },

  // Footer
  "footer.brand": { en: "EL-YANIS Real Estate", fr: "EL-YANIS Immobilier", ar: "العنيس للعقارات" },
  "footer.desc": { en: "Your trusted partner for premium real estate in western Algeria.", fr: "Votre partenaire de confiance pour l'immobilier haut de gamme dans l'ouest algérien.", ar: "شريكك الموثوق للعقارات الفاخرة في غرب الجزائر." },
  "footer.links": { en: "Quick Links", fr: "Liens Rapides", ar: "روابط سريعة" },
  "footer.contactTitle": { en: "Contact Us", fr: "Contactez-nous", ar: "اتصل بنا" },
  "footer.rights": { en: "All rights reserved.", fr: "Tous droits réservés.", ar: "جميع الحقوق محفوظة." },

  // Common
  "common.loading": { en: "Loading...", fr: "Chargement...", ar: "جاري التحميل..." },
};

export default translations;
