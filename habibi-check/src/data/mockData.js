export const transactions = [
  // ==========================================
  // 1. Al Reem Island
  // ==========================================
  // Sun & Sky Towers (Aldar): Avg 1,100 ~ 1,500 AED/sqft
  {
    id: "reem-1",
    name: "Sun & Sky Towers",
    projectName: "Sun & Sky Towers",
    buildingName: "Sky Tower",
    island: "Al Reem Island",
    location: "Al Reem Island",
    developer: "Aldar",
    unitType: "Apartment",
    bedrooms: "1BR",
    areaSqFt: 850,
    transactionAmountAED: 1105000, // 1,300 AED/sqft
    askingAED: 1088000,            // -1.5% 적정 호가
    serviceChargeSqFt: 15,
    completionStatus: "Ready",
    propertyClass: "Ready",
    coordinates: { lat: 24.4947, lng: 54.4069 },
    transactionDate: "2023-10-15"
  },
  {
    id: "reem-2",
    name: "Sun & Sky Towers",
    projectName: "Sun & Sky Towers",
    buildingName: "Sun Tower",
    island: "Al Reem Island",
    location: "Al Reem Island",
    developer: "Aldar",
    unitType: "Apartment",
    bedrooms: "2BR",
    areaSqFt: 1350,
    transactionAmountAED: 1890000, // 1,400 AED/sqft
    askingAED: 1814400,            // -4.0% 급매
    serviceChargeSqFt: 15,
    completionStatus: "Ready",
    propertyClass: "Ready",
    coordinates: { lat: 24.4947, lng: 54.4069 },
    transactionDate: "2023-11-02"
  },
  // The Gate Towers (Aldar): Avg 1,100 ~ 1,500 AED/sqft
  {
    id: "reem-3",
    name: "The Gate Towers",
    projectName: "The Gate Towers",
    buildingName: "Gate Tower 1",
    island: "Al Reem Island",
    location: "Al Reem Island",
    developer: "Aldar",
    unitType: "Apartment",
    bedrooms: "2BR",
    areaSqFt: 1200,
    transactionAmountAED: 1440000, // 1,200 AED/sqft
    askingAED: 1540800,            // +7.0% 시세 대비 높음
    serviceChargeSqFt: 16,
    completionStatus: "Ready",
    propertyClass: "Ready",
    coordinates: { lat: 24.4975, lng: 54.4042 },
    transactionDate: "2023-10-12"
  },
  {
    id: "reem-4",
    name: "The Gate Towers",
    projectName: "The Gate Towers",
    buildingName: "Gate Tower 2",
    island: "Al Reem Island",
    location: "Al Reem Island",
    developer: "Aldar",
    unitType: "Apartment",
    bedrooms: "3BR",
    areaSqFt: 1750,
    transactionAmountAED: 2275000, // 1,300 AED/sqft
    askingAED: 2320500,            // +2.0% 적정 호가
    serviceChargeSqFt: 16,
    completionStatus: "Ready",
    propertyClass: "Ready",
    coordinates: { lat: 24.4975, lng: 54.4042 },
    transactionDate: "2023-09-20"
  },
  // Marina Square (Tamouh): Avg 1,100 ~ 1,500 AED/sqft
  {
    id: "reem-5",
    name: "Marina Square",
    projectName: "Marina Square",
    buildingName: "Marina Heights",
    island: "Al Reem Island",
    location: "Al Reem Island",
    developer: "Tamouh",
    unitType: "Apartment",
    bedrooms: "Studio",
    areaSqFt: 600,
    transactionAmountAED: 660000,  // 1,100 AED/sqft
    askingAED: 640200,             // -3.0% 저렴
    serviceChargeSqFt: 14,
    completionStatus: "Ready",
    propertyClass: "Ready",
    coordinates: { lat: 24.4893, lng: 54.3986 },
    transactionDate: "2023-10-05"
  },
  {
    id: "reem-6",
    name: "Marina Square",
    projectName: "Marina Square",
    buildingName: "Ocean Terrace",
    island: "Al Reem Island",
    location: "Al Reem Island",
    developer: "Tamouh",
    unitType: "Apartment",
    bedrooms: "1BR",
    areaSqFt: 900,
    transactionAmountAED: 1035000, // 1,150 AED/sqft
    askingAED: 1097100,            // +6.0% 시세 대비 높음
    serviceChargeSqFt: 14,
    completionStatus: "Ready",
    propertyClass: "Ready",
    coordinates: { lat: 24.4893, lng: 54.3986 },
    transactionDate: "2023-08-25"
  },

  // ==========================================
  // 2. Yas Island
  // ==========================================
  // Water's Edge (Aldar): Avg 1,350 ~ 1,900 AED/sqft
  {
    id: "yas-1",
    name: "Water's Edge",
    projectName: "Water's Edge",
    buildingName: "Building 1",
    island: "Yas Island",
    location: "Yas Island",
    developer: "Aldar",
    unitType: "Apartment",
    bedrooms: "1BR",
    areaSqFt: 700,
    transactionAmountAED: 980000,  // 1,400 AED/sqft
    askingAED: 940800,             // -4.0% 급매
    serviceChargeSqFt: 15,
    completionStatus: "Ready",
    propertyClass: "Ready",
    coordinates: { lat: 24.4842, lng: 54.6062 },
    transactionDate: "2023-09-28"
  },
  {
    id: "yas-2",
    name: "Water's Edge",
    projectName: "Water's Edge",
    buildingName: "Building 2",
    island: "Yas Island",
    location: "Yas Island",
    developer: "Aldar",
    unitType: "Apartment",
    bedrooms: "2BR",
    areaSqFt: 1100,
    transactionAmountAED: 1650000, // 1,500 AED/sqft
    askingAED: 1683000,            // +2.0% 적정 호가
    serviceChargeSqFt: 15,
    completionStatus: "Ready",
    propertyClass: "Ready",
    coordinates: { lat: 24.4842, lng: 54.6062 },
    transactionDate: "2023-11-10"
  },
  // Ansam (Aldar): Avg 1,350 ~ 1,900 AED/sqft
  {
    id: "yas-3",
    name: "Ansam",
    projectName: "Ansam",
    buildingName: "Ansam 1",
    island: "Yas Island",
    location: "Yas Island",
    developer: "Aldar",
    unitType: "Apartment",
    bedrooms: "2BR",
    areaSqFt: 1300,
    transactionAmountAED: 2210000, // 1,700 AED/sqft
    askingAED: 2364700,            // +7.0% 시세 대비 높음
    serviceChargeSqFt: 17,
    completionStatus: "Ready",
    propertyClass: "Ready",
    coordinates: { lat: 24.4800, lng: 54.5950 },
    transactionDate: "2023-10-02"
  },
  {
    id: "yas-4",
    name: "Ansam",
    projectName: "Ansam",
    buildingName: "Ansam 2",
    island: "Yas Island",
    location: "Yas Island",
    developer: "Aldar",
    unitType: "Apartment",
    bedrooms: "3BR",
    areaSqFt: 1800,
    transactionAmountAED: 3240000, // 1,800 AED/sqft
    askingAED: 3142800,            // -3.0% 저렴
    serviceChargeSqFt: 17,
    completionStatus: "Ready",
    propertyClass: "Ready",
    coordinates: { lat: 24.4800, lng: 54.5950 },
    transactionDate: "2023-09-05"
  },
  // Yas Acres (Aldar): Avg 1,350 ~ 1,900 AED/sqft
  {
    id: "yas-5",
    name: "Yas Acres",
    projectName: "Yas Acres",
    buildingName: "The Cedars",
    island: "Yas Island",
    location: "Yas Island",
    developer: "Aldar",
    unitType: "Townhouse",
    bedrooms: "3BR",
    areaSqFt: 3000,
    transactionAmountAED: 4500000, // 1,500 AED/sqft
    askingAED: 4545000,            // +1.0% 적정 호가
    serviceChargeSqFt: 12,
    completionStatus: "Ready",
    propertyClass: "Ready",
    coordinates: { lat: 24.5083, lng: 54.6225 },
    transactionDate: "2023-09-15"
  },
  {
    id: "yas-6",
    name: "Yas Acres",
    projectName: "Yas Acres",
    buildingName: "The Magnolias",
    island: "Yas Island",
    location: "Yas Island",
    developer: "Aldar",
    unitType: "Townhouse",
    bedrooms: "4BR",
    areaSqFt: 4000,
    transactionAmountAED: 6400000, // 1,600 AED/sqft
    askingAED: 6784000,            // +6.0% 시세 대비 높음
    serviceChargeSqFt: 12,
    completionStatus: "Off-plan",
    propertyClass: "Off-plan",
    coordinates: { lat: 24.5083, lng: 54.6225 },
    transactionDate: "2023-08-30"
  },

  // ==========================================
  // 3. Saadiyat Island
  // ==========================================
  // Mamsha Al Saadiyat (Aldar): Avg 1,800 ~ 3,800 AED/sqft
  {
    id: "saad-1",
    name: "Mamsha Al Saadiyat",
    projectName: "Mamsha Al Saadiyat",
    buildingName: "Azure",
    island: "Saadiyat Island",
    location: "Saadiyat Island",
    developer: "Aldar",
    unitType: "Apartment",
    bedrooms: "1BR",
    areaSqFt: 1200,
    transactionAmountAED: 3360000, // 2,800 AED/sqft
    askingAED: 3259200,            // -3.0% 저렴
    serviceChargeSqFt: 22,
    completionStatus: "Ready",
    propertyClass: "Ready",
    coordinates: { lat: 24.5422, lng: 54.4305 },
    transactionDate: "2023-10-10"
  },
  {
    id: "saad-2",
    name: "Mamsha Al Saadiyat",
    projectName: "Mamsha Al Saadiyat",
    buildingName: "Turquoise",
    island: "Saadiyat Island",
    location: "Saadiyat Island",
    developer: "Aldar",
    unitType: "Apartment",
    bedrooms: "2BR",
    areaSqFt: 1800,
    transactionAmountAED: 5400000, // 3,000 AED/sqft
    askingAED: 5886000,            // +9.0% 시세 대비 높음
    serviceChargeSqFt: 22,
    completionStatus: "Ready",
    propertyClass: "Ready",
    coordinates: { lat: 24.5422, lng: 54.4305 },
    transactionDate: "2023-11-05"
  },
  // Saadiyat Beach Residences (Aldar): Avg 1,800 ~ 3,800 AED/sqft
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
    askingAED: 3264000,            // +2.0% 적정 호가
    serviceChargeSqFt: 19,
    completionStatus: "Ready",
    propertyClass: "Ready",
    coordinates: { lat: 24.5367, lng: 54.4344 },
    transactionDate: "2023-10-01"
  },
  {
    id: "saad-4",
    name: "Saadiyat Beach Residences",
    projectName: "Saadiyat Beach Residences",
    buildingName: "Building 2",
    island: "Saadiyat Island",
    location: "Saadiyat Island",
    developer: "Aldar",
    unitType: "Apartment",
    bedrooms: "3BR",
    areaSqFt: 2200,
    transactionAmountAED: 4620000, // 2,100 AED/sqft
    askingAED: 4435200,            // -4.0% 급매
    serviceChargeSqFt: 19,
    completionStatus: "Ready",
    propertyClass: "Ready",
    coordinates: { lat: 24.5367, lng: 54.4344 },
    transactionDate: "2023-08-15"
  },
  // The Grove (Aldar): Avg 1,800 ~ 3,800 AED/sqft
  {
    id: "saad-5",
    name: "The Grove",
    projectName: "The Grove",
    buildingName: "Grove Views",
    island: "Saadiyat Island",
    location: "Saadiyat Island",
    developer: "Aldar",
    unitType: "Apartment",
    bedrooms: "2BR",
    areaSqFt: 1400,
    transactionAmountAED: 3360000, // 2,400 AED/sqft
    askingAED: 3393600,            // +1.0% 적정 호가
    serviceChargeSqFt: 20,
    completionStatus: "Off-plan",
    propertyClass: "Off-plan",
    coordinates: { lat: 24.5312, lng: 54.4225 },
    transactionDate: "2023-09-20"
  },
  {
    id: "saad-6",
    name: "The Grove",
    projectName: "The Grove",
    buildingName: "Grove Museum Views",
    island: "Saadiyat Island",
    location: "Saadiyat Island",
    developer: "Aldar",
    unitType: "Apartment",
    bedrooms: "Studio",
    areaSqFt: 550,
    transactionAmountAED: 1430000, // 2,600 AED/sqft
    askingAED: 1544400,            // +8.0% 시세 대비 높음
    serviceChargeSqFt: 20,
    completionStatus: "Off-plan",
    propertyClass: "Off-plan",
    coordinates: { lat: 24.5312, lng: 54.4225 },
    transactionDate: "2023-11-01"
  }
];
