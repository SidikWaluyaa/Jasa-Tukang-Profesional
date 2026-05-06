import Papa from 'papaparse';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1UU30h8ngmKvZbvXPmkuRPUUxpY4a955bCLMZvtPXFKo/export?format=csv&gid=37982703';

export const fetchData = async () => {
  return new Promise((resolve, reject) => {
    Papa.parse(SHEET_URL, {
      download: true,
      header: true,
      complete: (results) => {
        // Normalize headers: trim whitespace and remove potential hidden characters
        const normalizedData = results.data.map(row => {
          const newRow = {};
          Object.keys(row).forEach(key => {
            newRow[key.trim()] = row[key];
          });
          return newRow;
        });
        resolve(normalizedData);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

export const processStats = (data, questionKey, { multiSelect = true, customDenominator = null } = {}) => {
  const stats = {};
  let totalAnswers = 0;
  let totalRespondents = 0;

  const actualKey = data.length > 0
    ? Object.keys(data[0]).find(k =>
        k.trim().toLowerCase().includes(questionKey.trim().toLowerCase()) ||
        questionKey.trim().toLowerCase().includes(k.trim().toLowerCase())
      )
    : null;

  if (!actualKey) return [];

  data.forEach(row => {
    const answer = row[actualKey];
    if (answer && answer.trim()) {
      totalRespondents++;
      if (multiSelect) {
        // Split by comma for multi-select questions
        const parts = answer.split(',').map(p => p.trim()).filter(Boolean);
        parts.forEach(part => {
          const key = part.toUpperCase();
          stats[key] = (stats[key] || 0) + 1;
          totalAnswers++;
        });
      } else {
        // Single-select: count whole answer
        const key = answer.trim().toUpperCase();
        stats[key] = (stats[key] || 0) + 1;
        totalAnswers++;
      }
    }
  });

  const denominator = customDenominator || (multiSelect ? totalAnswers : totalRespondents);

  return Object.entries(stats).map(([label, count]) => ({
    label,
    count,
    percentage: denominator > 0 ? ((count / denominator) * 100).toFixed(0) + '%' : '0%'
  })).sort((a, b) => b.count - a.count);
};
