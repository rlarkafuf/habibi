import { transactions } from '../data/mockData.js';

// Simulated API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Precise Dual-Price Gap Engine (호가 vs DARI 실거래가)
 */
export function analyzePriceGap(askingAED, areaSqFt, bedroom, projectTxs = []) {
  const sameBedroomTxs = projectTxs.filter(tx => tx.bedrooms === bedroom);
  const baselinePool = sameBedroomTxs.length > 0 ? sameBedroomTxs : projectTxs;

  const dariAvgSqFt =
    baselinePool.length > 0
      ? baselinePool.reduce((sum, tx) => sum + tx.transactionAmountAED / tx.areaSqFt, 0) / baselinePool.length
      : askingAED / areaSqFt;

  const askingSqFt = askingAED / areaSqFt;
  const rawGap = dariAvgSqFt > 0 ? ((askingSqFt - dariAvgSqFt) / dariAvgSqFt) * 100 : 0;
  const gapRate = Number(rawGap.toFixed(1));

  if (gapRate <= -3) {
    return {
      askingSqFt: Math.round(askingSqFt),
      dariAvgSqFt: Math.round(dariAvgSqFt),
      gapRate,
      badge: `🔥 평균 시세 대비 ${Math.abs(gapRate)}% 저렴`,
      type: 'below'
    };
  }

  if (gapRate >= 5) {
    return {
      askingSqFt: Math.round(askingSqFt),
      dariAvgSqFt: Math.round(dariAvgSqFt),
      gapRate,
      badge: `📈 시세 대비 +${gapRate}%`,
      type: 'premium'
    };
  }

  return {
    askingSqFt: Math.round(askingSqFt),
    dariAvgSqFt: Math.round(dariAvgSqFt),
    gapRate,
    badge: '⚖️ 적정 호가',
    type: 'fair'
  };
}

export const propertyService = {
  analyzePriceGap,

  async getAllProperties() {
    await delay(150);
    return transactions;
  },

  async getProperties(filters = {}) {
    await delay(150);

    return transactions.filter(p => {
      const region = p.island || p.location;
      const targetRegion = filters.island && filters.island !== 'All' ? filters.island : filters.location;
      if (targetRegion && targetRegion !== 'All' && region !== targetRegion) return false;

      if (filters.developer && filters.developer !== 'All' && p.developer !== filters.developer) return false;

      const status = p.completionStatus || p.propertyClass;
      if (filters.completionStatus && filters.completionStatus !== 'All' && status !== filters.completionStatus) return false;

      if (filters.unitType && filters.unitType !== 'All' && p.unitType !== filters.unitType) return false;

      if (filters.bedrooms && filters.bedrooms !== 'All') {
        const normalizedBed = filters.bedrooms === '3BR+' ? '3BR' : filters.bedrooms;
        if (p.bedrooms !== filters.bedrooms && p.bedrooms !== normalizedBed) return false;
      }

      if (filters.minPrice && p.askingAED < parseInt(filters.minPrice, 10)) return false;
      if (filters.maxPrice && p.askingAED > parseInt(filters.maxPrice, 10)) return false;
      return true;
    });
  },

  async calculateProjectMetrics(projectName) {
    const projectTransactions = transactions.filter(
      p => (p.projectName || p.name) === projectName
    );

    if (projectTransactions.length === 0) {
      return { averagePricePerSqFt: 0, projectTransactions: [], recentTransactions: [] };
    }

    const totalSqFtPrice = projectTransactions.reduce(
      (sum, tx) => sum + tx.transactionAmountAED / tx.areaSqFt,
      0
    );
    const averagePricePerSqFt = Math.round(totalSqFtPrice / projectTransactions.length);

    const recentTransactions = [...projectTransactions]
      .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
      .slice(0, 5)
      .map(tx => ({
        date: tx.transactionDate,
        amount: tx.transactionAmountAED,
        askingAED: tx.askingAED,
        unit: `${tx.buildingName || tx.name} • ${tx.bedrooms}`,
        pricePerSqFt: Math.round(tx.transactionAmountAED / tx.areaSqFt)
      }));

    return {
      averagePricePerSqFt,
      projectTransactions,
      recentTransactions
    };
  },

  evaluateDeal(property, projectMetrics) {
    const txPool = projectMetrics?.projectTransactions?.length
      ? projectMetrics.projectTransactions
      : transactions.filter(t => (t.projectName || t.name) === (property.projectName || property.name));

    return analyzePriceGap(property.askingAED, property.areaSqFt, property.bedrooms, txPool);
  }
};
