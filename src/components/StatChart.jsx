import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend);

const StatChart = ({ title, stats }) => {
  const data = {
    labels: stats.map(s => s.label),
    datasets: [
      {
        data: stats.map(s => s.count),
        backgroundColor: [
          '#6366f1',
          '#f59e0b',
          '#10b981',
          '#ef4444',
          '#8b5cf6',
          '#ec4899',
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 12,
            weight: '600',
          },
          usePointStyle: true,
        },
      },
    },
    cutout: '60%',
    maintainAspectRatio: false,
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="card"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <div className="stat-header" style={{ alignSelf: 'flex-start', width: '100%' }}>{title} (Chart)</div>
      <div style={{ width: '100%', height: '250px', marginTop: '1rem' }}>
        <Pie data={data} options={options} />
      </div>
    </motion.div>
  );
};

export default StatChart;
