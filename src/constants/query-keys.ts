export const QUERY_KEYS = {
  SERVICES: ["services"],
  DUPLICATA: ["duplicata"],

  SELLERS: ["sellers"],
  SELLER_SERVICE_COMMISSIONS: (sellerAccountId: string) => [
    "seller-service-commissions",
    sellerAccountId,
  ],
  BANKS: ["banks"],

  OWNERS: ["property", "owners"],
  PROPERTY_TYPES: ["property", "types"],
  OWNER_DETAIL: (ownerId: string) => ["property", "owners", ownerId],
  PROPERTIES: ["property", "list"],
  PROPERTY_DETAIL: (propertyId: string) => ["property", "details", propertyId],

  // Rental
  RENTALS: ["rental", "list"],
  RENTAL_PERIOD_TYPES: ["rentals", "period-types"],
  RENTAL_CHARGES: ["rentals", "charges"],
};
