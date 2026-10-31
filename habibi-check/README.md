# Habibi Check

Habibi Check is the premier Abu Dhabi real estate analytics and transaction intelligence platform MVP. It focuses exclusively on Abu Dhabi's major freehold areas: **Al Reem Island**, **Yas Island**, and **Saadiyat Island**.

## Features

- **Region & Filtering System:** Filter properties by Region (Al Reem, Yas, Saadiyat), Property Type (Apartment, Townhouse, Villa), Bedrooms (Studio, 1BR, 2BR, 3BR+), and Price Range.
- **Transaction Data Architecture:** A clean Service/Repository pattern (`src/services/propertyService.js`) prepares the app for integration with real APIs (like DMT/DARI) or databases (PostgreSQL/Supabase) in the future with zero UI refactoring.
- **Analytics & Market Insights:**
  - Automatic calculation of Average Price per SqFt for each project/building.
  - Recent Transaction History.
  - "Hogangnono-style" Deal Evaluation Badges (🔥 Below Market, ⚖️ Fair Value, 📈 Premium Price).

## Technologies Used

- **Frontend:** React with Vite.
- **Styling:** Tailwind CSS (v4).
- **Icons:** Lucide React.

## How to Run Locally

1. Ensure you have [Node.js](https://nodejs.org/) installed.
2. Clone this repository (or copy the files).
3. Navigate to the project directory:
   `cd habibi-check`
4. Install dependencies:
   `npm install`
5. Start the development server:
   `npm run dev`
6. Open your browser and navigate to the URL provided in the terminal (usually `http://localhost:5173`).
