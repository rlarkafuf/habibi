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

    if (filters.island && filters.island !== 'All') {
      result = result.filter(p => p.island === filters.island);
    }
    if (filters.developer && filters.developer !== 'All') {
      result = result.filter(p => p.developer === filters.developer);
    }
    if (filters.completionStatus && filters.completionStatus !== 'All') {
      result = result.filter(p => p.completionStatus === filters.completionStatus);
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
      return { averagePricePerSqFt: 0, recentTransactions: [], projectTransactions: [] };
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
        askingAED: tx.askingAED,
        unit: tx.name + ' - ' + tx.bedrooms,
        pricePerSqFt: tx.transactionAmountAED / tx.areaSqFt
      }));

    return {
      averagePricePerSqFt,
      recentTransactions,
      projectTransactions
    };
  },

  /**
   * Analyze price gap compared to official DARI transaction averages for the exact same bedroom tier within the same project.
   */
  analyzePriceGap(askingAED, areaSqFt, bedroom, projectTxs) {
    const similarTxs = projectTxs.filter(tx => tx.bedrooms === bedroom);

    if (similarTxs.length === 0) {
      return { badge: "⚖️ 적정 호가", type: "fair", gapRate: 0 };
    }

    let totalDariAmount = 0;
    let totalDariArea = 0;

    similarTxs.forEach(tx => {
      totalDariAmount += tx.transactionAmountAED;
      totalDariArea += tx.areaSqFt;
    });

    const dariAvgSqFt = totalDariAmount / totalDariArea;
    const askingSqFt = askingAED / areaSqFt;

    const gapRate = ((askingSqFt - dariAvgSqFt) / dariAvgSqFt) * 100;
    const absGap = Math.abs(Math.round(gapRate));

    if (gapRate <= -3) {
      return { badge: `🔥 평균 시세 대비 ${absGap}% 저렴`, type: "below", gapRate };
    } else if (gapRate >= 5) {
      return { badge: `📈 시세 대비 +${absGap}%`, type: "premium", gapRate };
    } else {
      return { badge: "⚖️ 적정 호가", type: "fair", gapRate };
    }
  }
};
