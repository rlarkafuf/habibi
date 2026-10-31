import { transactions } from '../data/mockData';

// Simulated API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const propertyService = {
  /**
   * Fetch all properties
   */
  async getAllProperties() {
    await delay(300); // simulate network request
    return transactions;
  },

  /**
   * Fetch properties with filters applied
   */
  async getProperties(filters) {
    await delay(300);

    let result = transactions;

    if (filters.location && filters.location !== 'All') {
      result = result.filter(p => p.location === filters.location);
    }
    if (filters.unitType && filters.unitType !== 'All') {
      result = result.filter(p => p.unitType === filters.unitType);
    }
    if (filters.bedrooms && filters.bedrooms !== 'All') {
      result = result.filter(p => p.bedrooms === filters.bedrooms);
    }
    if (filters.minPrice) {
      result = result.filter(p => p.transactionAmountAED >= parseInt(filters.minPrice, 10));
    }
    if (filters.maxPrice) {
      result = result.filter(p => p.transactionAmountAED <= parseInt(filters.maxPrice, 10));
    }

    return result;
  },

  /**
   * Calculate project metrics like avg price/sqft and recent transactions
   */
  async calculateProjectMetrics(projectName) {
    await delay(100);
    const projectTransactions = transactions.filter(p => p.projectName === projectName);

    if (projectTransactions.length === 0) {
      return { averagePricePerSqFt: 0, recentTransactions: [] };
    }

    let totalAmount = 0;
    let totalArea = 0;

    projectTransactions.forEach(tx => {
      totalAmount += tx.transactionAmountAED;
      totalArea += tx.areaSqFt;
    });

    const averagePricePerSqFt = totalArea > 0 ? (totalAmount / totalArea) : 0;

    const recentTransactions = [...projectTransactions]
      .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
      .slice(0, 5)
      .map(tx => ({
        date: tx.transactionDate,
        amount: tx.transactionAmountAED,
        unit: tx.buildingName + ' - ' + tx.bedrooms,
        pricePerSqFt: tx.transactionAmountAED / tx.areaSqFt
      }));

    return {
      averagePricePerSqFt,
      recentTransactions
    };
  },

  /**
   * Evaluate a deal compared to its project average
   */
  evaluateDeal(property, projectMetrics) {
    const propertyPricePerSqFt = property.transactionAmountAED / property.areaSqFt;
    const avgPrice = projectMetrics.averagePricePerSqFt;

    if (!avgPrice || avgPrice === 0) return { badge: "⚖️ Fair Value", type: "fair" };

    const ratio = propertyPricePerSqFt / avgPrice;

    if (ratio < 0.95) {
      return { badge: "🔥 Below Market", type: "below" };
    } else if (ratio > 1.05) {
      return { badge: "📈 Premium Price", type: "premium" };
    } else {
      return { badge: "⚖️ Fair Value", type: "fair" };
    }
  }
};
