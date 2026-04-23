export const API_ENDPOINTS = {
  properties: "/api/properties",
  propertiesFeatured: "/api/properties/featured",
  property: (id: string) => `/api/properties/${encodeURIComponent(id)}`,
  agents: "/api/agents",
  services: "/api/services",
  contact: "/api/contact",
  inquiries: "/api/inquiries",
  adminUsers: "/api/admin/users",
  adminUser: (id: string) => `/api/admin/users/${encodeURIComponent(id)}`,
  adminDashboard: "/api/admin/dashboard",
  adminInquiries: "/api/admin/inquiries",
  adminContactSubmission: (id: string) =>
    `/api/admin/contact-submissions/${encodeURIComponent(id)}`,
  adminPropertyInquiry: (id: string) => `/api/admin/property-inquiries/${encodeURIComponent(id)}`,
  /** POST body: { contentType } — URL PUT présignée pour images annonces. */
  adminUploadPresign: "/api/admin/uploads/presign",
} as const;
