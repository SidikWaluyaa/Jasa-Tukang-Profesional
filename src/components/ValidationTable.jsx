import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const ValidationTable = ({ title, stats, weightMap, style }) => {
  // Calculate R (Total Score), SM (Max Score), and find overall validation %
  let totalScoreR = 0;
  let totalResponden = 0;
  const maxWeight = Math.max(...Object.values(weightMap));

  const rows = stats.map(stat => {
    const weight = weightMap[stat.label] || 0;
    const score = stat.count * weight;
    totalScoreR += score;
    totalResponden += stat.count;
    return { ...stat, weight, score };
  });

  const SM = totalResponden * maxWeight;
  const validationScore = SM > 0 ? ((totalScoreR / SM) * 100).toFixed(0) : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
      style={{ gridColumn: '1 / -1', borderLeft: '6px solid #10b981', ...style }}
    >
      <div className="table-responsive" style={{ overflowX: 'auto' }}>
        <table className="validation-table">
          <thead>
            <tr style={{ background: '#10b981', color: '#fff' }}>
              <th>{title}</th>
              <th style={{ textAlign: 'center' }}>Jumlah</th>
              <th style={{ textAlign: 'center' }}>Persentase</th>
              <th style={{ textAlign: 'center' }}>Bobot</th>
              <th style={{ textAlign: 'center' }}>Skor</th>
              <th style={{ textAlign: 'center', background: '#059669' }}>SM</th>
              <th style={{ textAlign: 'center', background: '#059669' }}>R/SM*100% (Score Validasi)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td style={{ fontWeight: 500 }}>{row.label}</td>
                <td style={{ textAlign: 'center' }}>{row.count}</td>
                <td style={{ textAlign: 'center' }}>{row.percentage}</td>
                <td style={{ textAlign: 'center', fontWeight: 700 }}>{row.weight}</td>
                <td style={{ textAlign: 'center' }}>{row.score}</td>
                {index === 0 && (
                  <td rowSpan={rows.length} style={{ textAlign: 'center', fontWeight: 800, fontSize: '1.2rem', verticalAlign: 'middle', background: '#ecfdf5' }}>
                    {SM}
                  </td>
                )}
                {index === 0 && (
                  <td rowSpan={rows.length} style={{ textAlign: 'center', verticalAlign: 'middle', background: '#d1fae5' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#059669' }}>{validationScore}%</div>
                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, opacity: 0.7 }}>Validasi Masalah</div>
                  </td>
                )}
              </tr>
            ))}
            <tr style={{ background: '#f0fdf4', fontWeight: 800 }}>
              <td>TOTAL</td>
              <td style={{ textAlign: 'center' }}>{totalResponden}</td>
              <td></td>
              <td></td>
              <td style={{ textAlign: 'center', color: '#059669' }}>{totalScoreR}</td>
              <td colSpan={2}></td>
            </tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ValidationTable;
