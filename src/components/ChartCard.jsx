import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend);

const PALETTE = [
  '#6366f1', '#8b5cf6', '#06b6d4', '#10b981',
  '#f59e0b', '#f43f5e', '#ec4899', '#0ea5e9',
];

// Proper Title Case converter
const toTitleCase = (str) =>
  str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

// Shorten for legend display
const shorten = (str, max = 28) =>
  str.length > max ? str.slice(0, max - 1) + '…' : str;

const ChartCard = ({ title, stats }) => {
  if (!stats || stats.length === 0) return null;

  const topLabel = stats[0] ? toTitleCase(stats[0].label) : '';
  const topPct   = stats[0] ? stats[0].percentage : '';

  const chartData = {
    labels: stats.map(s => shorten(toTitleCase(s.label))),
    datasets: [{
      data: stats.map(s => s.count),
      backgroundColor: PALETTE,
      borderWidth: 2,
      borderColor: '#ffffff',
      hoverOffset: 6,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 14,
          usePointStyle: true,
          pointStyleWidth: 8,
          boxHeight: 8,
          font: { family: 'Inter', size: 11, weight: '500' },
          color: '#475569',
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 10,
        titleFont: { family: 'Inter', size: 11, weight: '600' },
        bodyFont:  { family: 'Inter', size: 11 },
        cornerRadius: 8,
        callbacks: {
          title: (items) => toTitleCase(stats[items[0].dataIndex]?.label || ''),
          label: (ctx)   => `  ${ctx.parsed} responden (${stats[ctx.dataIndex]?.percentage})`,
        },
      },
    },
  };

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
    >
      <div className="card-header">
        <div>
          <div className="card-title">{title}</div>
          <div className="card-desc">Distribusi visual jawaban</div>
        </div>
      </div>

      <div className="card-body" style={{ paddingBottom: 0 }}>
        {/* Chart container with relative positioning for center label */}
        <div style={{ position: 'relative', width: '100%', height: '230px' }}>
          <Doughnut data={chartData} options={options} />

          {/* Center label — positioned absolutely, pointer-events off so tooltip still works */}
          <div style={{
            position: 'absolute',
            top: '42%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
            zIndex: 0,
          }}>
            <div style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: 1,
              letterSpacing: '-0.04em',
            }}>
              {topPct}
            </div>
            <div style={{
              fontSize: '0.58rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginTop: 4,
            }}>
              terbanyak
            </div>
          </div>
        </div>

        {/* Top segment callout */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--sp-2)',
          margin: 'var(--sp-3) 0 var(--sp-2)',
          padding: 'var(--sp-2) var(--sp-3)',
          background: 'var(--surface-2)',
          borderRadius: 'var(--radius-sm)',
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: PALETTE[0], flexShrink: 0,
          }} />
          <span style={{
            fontSize: '0.75rem', fontWeight: 600,
            color: 'var(--text-secondary)', lineHeight: 1.4,
          }}>
            {topLabel} ({topPct})
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ChartCard;
