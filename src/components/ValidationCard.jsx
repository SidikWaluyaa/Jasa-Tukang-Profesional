import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const toTitleCase = (str) =>
  str.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

const ValidationCard = ({ title, description, stats, weightMap, accentColor = 'var(--emerald-500)' }) => {
  let totalScoreR = 0;
  let totalResponden = 0;
  const maxWeight = Math.max(...Object.values(weightMap));

  // Build rows first, then sort by weight descending (match spreadsheet order)
  const rows = stats
    .map(stat => {
      const weight = weightMap[stat.label] ?? 0;
      const score = stat.count * weight;
      return { ...stat, weight, score };
    })
    .sort((a, b) => b.weight - a.weight);  // ← sort by bobot DESC

  // Accumulate totals after sorting
  rows.forEach(r => {
    totalScoreR   += r.score;
    totalResponden += r.count;
  });

  const SM = totalResponden * maxWeight;
  const validationScore = SM > 0 ? Math.round((totalScoreR / SM) * 100) : 0;

  const scoreColor = validationScore >= 70
    ? 'var(--emerald-500)'
    : validationScore >= 50
      ? 'var(--amber-500)'
      : 'var(--rose-500)';

  const scoreLabel = validationScore >= 70
    ? 'Tervalidasi Kuat'
    : validationScore >= 50
      ? 'Cukup Valid'
      : 'Perlu Perhatian';


  return (
    <motion.div
      className="card col-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ borderTop: `3px solid ${accentColor}` }}
    >
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
          <ShieldCheck size={16} color={accentColor} />
          <div>
            <div className="card-title">{title}</div>
            {description && <div className="card-desc">{description}</div>}
          </div>
        </div>

        {/* Score callout */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--sp-3) var(--sp-5)',
          flexShrink: 0,
        }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: scoreColor, lineHeight: 1, letterSpacing: '-0.04em' }}>
            {validationScore}%
          </div>
          <div style={{ fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginTop: 4 }}>
            Score Validasi
          </div>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: scoreColor, marginTop: 2 }}>
            {scoreLabel}
          </div>
        </div>
      </div>

      <div className="card-body-flush data-table-wrap">
        <table className="val-table">
          <thead>
            <tr>
              {/* Flexible column for long question text */}
              <th className="text-center" style={{ lineHeight: 1.4 }}>
                {description || 'Pilihan Jawaban'}
              </th>
              <th className="text-center" style={{ width: '80px' }}>Jumlah (n)</th>
              <th className="text-center" style={{ width: '90px' }}>Persentase</th>
              <th className="text-center" style={{ width: '70px' }}>Bobot (W)</th>
              <th className="text-center" style={{ width: '80px' }}>Skor (n×W)</th>
              <th className="text-center" style={{ width: '60px', color: accentColor }}>SM</th>
              <th className="text-center" style={{ width: '100px', color: accentColor }}>R/SM×100%</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td className="text-center" style={{ fontWeight: 500 }}>
                  {toTitleCase(row.label)}
                </td>
                <td className="text-center" style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                  {row.count}
                </td>
                <td className="text-center">
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    background: 'var(--surface-2)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                  }}>{row.percentage}</span>
                </td>
                <td className="text-center">
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 24,
                    height: 24,
                    background: index === 0 ? accentColor : 'var(--surface-2)',
                    color: index === 0 ? '#fff' : 'var(--text-secondary)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}>{row.weight}</span>
                </td>
                <td className="text-center" style={{ fontWeight: 700 }}>
                  {row.score}
                </td>
                {index === 0 && (
                  <td
                    rowSpan={rows.length}
                    className="text-center"
                    style={{ fontWeight: 800, fontSize: '1.1rem', background: 'var(--surface-2)', verticalAlign: 'middle' }}
                  >
                    {SM}
                  </td>
                )}
                {index === 0 && (
                  <td
                    rowSpan={rows.length}
                    className="text-center"
                    style={{ background: 'var(--surface-2)', verticalAlign: 'middle' }}
                  >
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: scoreColor }}>{validationScore}%</div>
                    <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginTop: 2 }}>{scoreLabel}</div>
                  </td>
                )}
              </tr>
            ))}
            <tr className="total-row">
              <td className="text-center">Total</td>
              <td className="text-center">{totalResponden}</td>
              <td colSpan={2} />
              <td className="text-center">{totalScoreR}</td>
              <td colSpan={2} />
            </tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ValidationCard;
