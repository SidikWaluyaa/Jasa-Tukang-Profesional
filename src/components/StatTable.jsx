import React from 'react';
import { motion } from 'framer-motion';

const StatTable = ({ title, stats }) => {
  const totalCount = stats.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <table>
        <thead>
          <tr>
            <th>{title}</th>
            <th style={{ width: '80px', textAlign: 'center' }}>Total</th>
            <th style={{ width: '100px', textAlign: 'center' }}>Persentase</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat, index) => (
            <tr key={index}>
              <td>{stat.label}</td>
              <td style={{ textAlign: 'center', fontWeight: 600 }}>{stat.count}</td>
              <td style={{ textAlign: 'center' }}>
                <span className="percentage-badge">{stat.percentage}</span>
              </td>
            </tr>
          ))}
          <tr className="total-row">
            <td>TOTAL</td>
            <td style={{ textAlign: 'center' }}>{totalCount}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </motion.div>
  );
};

export default StatTable;
