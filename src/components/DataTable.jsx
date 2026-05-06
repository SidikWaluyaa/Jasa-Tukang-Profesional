import React from 'react';
import { motion } from 'framer-motion';

const toTitleCase = (str) =>
  str.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

const barColors = [
  'var(--indigo-500)',
  '#8b5cf6',
  'var(--cyan-500)',
  'var(--emerald-500)',
  'var(--amber-500)',
  'var(--rose-500)',
  '#ec4899',
  '#0ea5e9',
];

const DataTable = ({ title, description, insight, stats, accentColor }) => {
  const totalCount = stats.reduce((acc, s) => acc + s.count, 0);
  const maxCount = stats[0]?.count || 1;
  const barColor = accentColor || 'var(--indigo-500)';

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={accentColor ? { '--kpi-color': accentColor } : {}}
    >
      <div className="card-header">
        <div>
          <div className="card-title">{title}</div>
          {description && <div className="card-desc">{description}</div>}
        </div>
        <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', flexShrink: 0 }}>
          n={totalCount}
        </div>
      </div>

      {insight && (
        <div style={{ padding: '0 var(--sp-6) var(--sp-4)' }}>
          <div className={`insight-box ${insight.type || ''}`}>
            <p>💡 {insight.text}</p>
          </div>
        </div>
      )}

      <div className="card-body-flush data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '45px' }} className="text-center">No</th>
              <th style={{ textAlign: 'left' }}>{description || 'Pilihan Jawaban'}</th>
              <th className="text-center" style={{ width: '80px' }}>Total</th>
              <th className="text-center" style={{ width: '110px' }}>Persentase</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((stat, index) => {
              const isTop = index === 0;
              return (
                <tr key={index}>
                  <td className="text-center">
                    <span className={`rank-badge ${isTop ? 'top' : ''}`}>{index + 1}</span>
                  </td>
                  <td style={{ fontWeight: isTop ? 600 : 400 }}>
                    {toTitleCase(stat.label)}
                  </td>
                  <td className="text-center" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {stat.count}
                  </td>
                  <td className="text-center">
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 10px',
                      background: isTop ? barColor : 'var(--surface-2)',
                      color: isTop ? '#fff' : 'var(--text-secondary)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}>{stat.percentage}</span>
                  </td>
                </tr>
              );
            })}
            <tr className="total-row">
              <td colSpan={2} className="text-center">Total</td>
              <td className="text-center">{totalCount}</td>
              <td />
            </tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default DataTable;
