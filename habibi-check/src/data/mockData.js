export const transactions = [
  // ==========================================
  // 1. Al Reem Island (림 아일랜드)
  // ==========================================
  // Sun & Sky Towers (Aldar): Avg 1,200 ~ 1,400 AED/sqft, Service Charge ~17 AED/sqft
  {
    id: "reem-1",
    name: "Sun & Sky Towers",
    projectName: "Sun & Sky Towers",
    buildingName: "Sun Tower",
    island: "Al Reem Island",
    location: "Al Reem Island",
    developer: "Aldar",
    unitType: "Apartment",
    bedrooms: "1BR",
    areaSqFt: 960,
    transactionAmountAED: 1210000, // ~1,260 AED/sqft
    askingAED: 1235000,            // ~1,286 AED/sqft (+2.1% 적정 호가)
    serviceChargeSqFt: 17,
    completionStatus: "Ready",
    propertyClass: "Ready",
    coordinates: { lat: 24.4947, lng: 54.4069 },
    transactionDate: "2026-10-04"
  },
  {
    id: "reem-2",
    name: "Sun & Sky Towers",
    projectName: "Sun & Sky Towers",
    buildingName: "Sky Tower",
    island: "Al Reem Island",
    location: "Al Reem Island",
    developer: "Aldar",
    unitType: "Apartment",
    bedrooms: "2BR",
    areaSqFt: 1450,
    transactionAmountAED: 1914000, // 1,320 AED/sqft
    askingAED: 1815000,            // ~1,252 AED/sqft (-5.2% 급매)
    serviceChargeSqFt: 17,
    completionStatus: "Ready",
    propertyClass: "Ready",
    coordinates: { lat: 24.4947, lng: 54.4069 },
    transactionDate: "2026-09-18"
  },
  {
    id: "reem-3",
    name: "Sun & Sky Towers",
    projectName: "Sun & Sky Towers",
    buildingName: "Sun Tower",
    island: "Al Reem Island",
    location: "Al Reem Island",
    developer: "Aldar",
    unitType: "Apartment",
    bedrooms: "3BR",
    areaSqFt: 2100,
    transactionAmountAED: 2730000, // 1,300 AED/sqft
    askingAED: 2920000,            // ~1,390 AED/sqft (+7.0% 시세 대비 높음)
    serviceChargeSqFt: 17,
    completionStatus: "Ready",
    propertyClass: "Ready",
    coordinates: { lat: 24.4947, lng: 54.4069 },
    transactionDate: "2026-08-22"
  },

  // The Gate Towers (Aldar): Avg 1,250 ~ 1,500 AED/sqft, Service Charge ~19 AED/sqft
  {
    id: "reem-4",
    name: "The Gate Towers",
    projectName: "The Gate Towers",
    buildingName: "Gate Tower 1",
    island: "Al Reem Island",
    location: "Al Reem Island",
    developer: "Aldar",
    unitType: "Apartment",
    bedrooms: "1BR",
    areaSqFt: 910,
    transactionAmountAED: 1246700, // 1,370 AED/sqft
    askingAED: 1185000,            // ~1,302 AED/sqft (-4.9% 저렴)
    serviceChargeSqFt: 19,
    completionStatus: "Ready",
    propertyClass: "Ready",
    coordinates: { lat: 24.4975, lng: 54.4042 },
    transactionDate: "2026-09-25"
  },
  {
    id: "reem-5",
    name: "The Gate Towers",
    projectName: "The Gate Towers",
    buildingName: "Gate Tower 2",
    island: "Al Reem Island",
    location: "Al Reem Island",
    developer: "Aldar",
    unitType: "Apartment",
    bedrooms: "2BR",
    areaSqFt: 1380,
    transactionAmountAED: 1959600, // 1,420 AED/sqft
    askingAED: 2090000,            // ~1,514 AED/sqft (+6.7% 시세 대비 높음)
    serviceChargeSqFt: 19,
    completionStatus: "Ready",
    propertyClass: "Ready",
    coordinates: { lat: 24.4975, lng: 54.4042 },
    transactionDate: "2026-10-11"
  },

  // Marina Square (Tamouh): Avg 1,100 ~ 1,300 AED/sqft, Service Charge ~16 AED/sqft
  {
    id: "reem-6",
    name: "Marina Square",
    projectName: "Marina Square",
    buildingName: "Marina Heights",
    island: "Al Reem Island",
    location: "Al Reem Island",
    developer: "Tamouh",
    unitType: "Apartment",
    bedrooms: "1BR",
    areaSqFt: 900,
    transactionAmountAED: 1080000, // 1,200 AED/sqft
    askingAED: 1095000,            // ~1,217 AED/sqft (+1.4% 적정 호가)
    serviceChargeSqFt: 16,
    completionStatus: "Ready",
    propertyClass: "Ready",
    coordinates: { lat: 24.4893, lng: 54.3986 },
    transactionDate: "2026-10-01"
  },
  {
    id: "reem-7",
    name: "Marina Square",
    projectName: "Marina Square",
    buildingName: "Ocean Terrace",
    island: "Al Reem Island",
    location: "Al Reem Island",
    developer: "Tamouh",
    unitType: "Apartment",
    bedrooms: "2BR",
    areaSqFt: 1320,
    transactionAmountAED: 1584000, // 1,200 AED/sqft
    askingAED: 1518000,            // 1,150 AED/sqft (-4.2% 저렴)
    serviceChargeSqFt: 16,
    completionStatus: "Ready",
    propertyClass: "Ready",
    coordinates: { lat: 24.4893, lng: 54.3986 },
    transactionDate: "2026-09-12"
  },

  // ==========================================
  // 2. Yas Island (야스 아일랜드)
  // ==========================================
  // Water's Edge (Aldar): Avg 1,350 ~ 1,600 AED/sqft, Service Charge ~15 AED/sqft
  {
    id: "yas-1",
    name: "Water's Edge",
    projectName: "Water's Edge",
    buildingName: "Building 4",
    island: "Yas Island",
    location: "Yas Island",
    developer: "Aldar",
    unitType: "Apartment",
    bedrooms: "Studio",
    areaSqFt: 475,
    transactionAmountAED: 688750,  // 1,450 AED/sqft
    askingAED: 655000,             // ~1,379 AED/sqft (-4.9% 저렴)
    serviceChargeSqFt: 15,
    completionStatus: "Ready",
    propertyClass: "Ready",
    coordinates: { lat: 24.4842, lng: 54.6062 },
    transactionDate: "2026-09-29"
  },
  {
    id: "yas-2",
    name: "Water's Edge",
    projectName: "Water's Edge",
    buildingName: "Building 6 (Canal View)",
    island: "Yas Island",
    location: "Yas Island",
    developer: "Aldar",
    unitType: "Apartment",
    bedrooms: "1BR",
    areaSqFt: 710,
    transactionAmountAED: 1050800, // 1,480 AED/sqft
    askingAED: 1065000,            // ~1,500 AED/sqft (+1.4% 적정 호가)
    serviceChargeSqFt: 15,
    completionStatus: "Ready",
    propertyClass: "Ready",
    coordinates: { lat: 24.4842, lng: 54.6062 },
    transactionDate: "2026-10-02"
  },

  // Ansam (Aldar): Avg 1,500 ~ 1,900 AED/sqft, Service Charge ~17 AED/sqft
  {
    id: "yas-3",
    name: "Ansam",
    projectName: "Ansam",
    buildingName: "Ansam 3 (Golf Course View)",
    island: "Yas Island",
    location: "Yas Island",
    developer: "Aldar",
    unitType: "Apartment",
    bedrooms: "2BR",
    areaSqFt: 1290,
    transactionAmountAED: 2193000, // 1,700 AED/sqft
    askingAED: 2335000,            // ~1,810 AED/sqft (+6.5% 시세 대비 높음)
    serviceChargeSqFt: 17,
    completionStatus: "Ready",
    propertyClass: "Ready",
    coordinates: { lat: 24.4800, lng: 54.5950 },
    transactionDate: "2026-10-08"
  },
  {
    id: "yas-4",
    name: "Ansam",
    projectName: "Ansam",
    buildingName: "Ansam 1",
    island: "Yas Island",
    location: "Yas Island",
    developer: "Aldar",
    unitType: "Apartment",
    bedrooms: "3BR",
    areaSqFt: 1800,
    transactionAmountAED: 3240000, // 1,800 AED/sqft
    askingAED: 3100000,            // ~1,722 AED/sqft (-4.3% 저렴)
    serviceChargeSqFt: 17,
    completionStatus: "Ready",
    propertyClass: "Ready",
    coordinates: { lat: 24.4800, lng: 54.5950 },
    transactionDate: "2026-09-14"
  },

  // Yas Acres (Aldar): Avg 1,400 ~ 1,700 AED/sqft (Townhouse tier)
  {
    id: "yas-5",
    name: "Yas Acres",
    projectName: "Yas Acres",
    buildingName: "The Cedars (Townhouse)",
    island: "Yas Island",
    location: "Yas Island",
    developer: "Aldar",
    unitType: "Townhouse",
    bedrooms: "3BR",
    areaSqFt: 3120,
    transactionAmountAED: 4836000, // 1,550 AED/sqft
    askingAED: 4650000,            // ~1,490 AED/sqft (-3.8% 저렴)
    serviceChargeSqFt: 12,
    completionStatus: "Ready",
    propertyClass: "Ready",
    coordinates: { lat: 24.5083, lng: 54.6225 },
    transactionDate: "2026-09-21"
  },

  // ==========================================
  // 3. Saadiyat Island (사디앗 아일랜드)
  // ==========================================
  // Mamsha Al Saadiyat (Aldar): Avg 2,500 ~ 3,800 AED/sqft, Service Charge ~24 AED/sqft
  {
    id: "saad-1",
    name: "Mamsha Al Saadiyat",
    projectName: "Mamsha Al Saadiyat",
    buildingName: "Turquoise 4",
    island: "Saadiyat Island",
    location: "Saadiyat Island",
    developer: "Aldar",
    unitType: "Apartment",
    bedrooms: "1BR",
    areaSqFt: 1220,
    transactionAmountAED: 3477000, // 2,850 AED/sqft
    askingAED: 3350000,            // ~2,746 AED/sqft (-3.7% 저렴)
    serviceChargeSqFt: 24,
    completionStatus: "Ready",
    propertyClass: "Ready",
    coordinates: { lat: 24.5422, lng: 54.4305 },
    transactionDate: "2026-09-30"
  },
  {
    id: "saad-2",
    name: "Mamsha Al Saadiyat",
    projectName: "Mamsha Al Saadiyat",
    buildingName: "Azure 2 (Soul Beach Front)",
    island: "Saadiyat Island",
    location: "Saadiyat Island",
    developer: "Aldar",
    unitType: "Apartment",
    bedrooms: "2BR",
    areaSqFt: 2050,
    transactionAmountAED: 6457500, // 3,150 AED/sqft
    askingAED: 6990000,            // ~3,410 AED/sqft (+8.2% 시세 대비 높음)
    serviceChargeSqFt: 24,
    completionStatus: "Ready",
    propertyClass: "Ready",
    coordinates: { lat: 24.5422, lng: 54.4305 },
    transactionDate: "2026-10-14"
  },

  // Saadiyat Beach Residences: Avg 1,800 ~ 2,400 AED/sqft, Service Charge ~19 AED/sqft
  {
    id: "saad-3",
    name: "Saadiyat Beach Residences",
    projectName: "Saadiyat Beach Residences",
    buildingName: "Building 1",
    island: "Saadiyat Island",
    location: "Saadiyat Island",
    developer: "Aldar",
    unitType: "Apartment",
    bedrooms: "2BR",
    areaSqFt: 1600,
    transactionAmountAED: 3200000, // 2,000 AED/sqft
    askingAED: 3390000,            // ~2,119 AED/sqft (+5.9% 시세 대비 높음)
    serviceChargeSqFt: 19,
    completionStatus: "Ready",
    propertyClass: "Ready",
    coordinates: { lat: 24.5367, lng: 54.4344 },
    transactionDate: "2026-09-19"
  },
  {
    id: "saad-4",
    name: "Saadiyat Beach Residences",
    projectName: "Saadiyat Beach Residences",
    buildingName: "Building 3",
    island: "Saadiyat Island",
    location: "Saadiyat Island",
    developer: "Aldar",
    unitType: "Apartment",
    bedrooms: "3BR",
    areaSqFt: 2280,
    transactionAmountAED: 4788000, // 2,100 AED/sqft
    askingAED: 4850000,            // ~2,127 AED/sqft (+1.3% 적정 호가)
    serviceChargeSqFt: 19,
    completionStatus: "Ready",
    propertyClass: "Ready",
    coordinates: { lat: 24.5367, lng: 54.4344 },
    transactionDate: "2026-10-05"
  },

  // The Grove: Avg 2,000 ~ 2,800 AED/sqft, Service Charge ~20 AED/sqft
  {
    id: "saad-5",
    name: "The Grove",
    projectName: "The Grove",
    buildingName: "Grove Museum Views",
    island: "Saadiyat Island",
    location: "Saadiyat Island",
    developer: "Aldar",
    unitType: "Apartment",
    bedrooms: "2BR",
    areaSqFt: 1380,
    transactionAmountAED: 3312000, // 2,400 AED/sqft
    askingAED: 3180000,            // ~2,304 AED/sqft (-4.0% 저렴)
    serviceChargeSqFt: 20,
    completionStatus: "Off-plan",
    propertyClass: "Off-plan",
    coordinates: { lat: 24.5312, lng: 54.4225 },
    transactionDate: "2026-10-12"
  }
];
