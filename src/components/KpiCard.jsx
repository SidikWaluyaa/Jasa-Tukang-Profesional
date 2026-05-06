import React from 'react';
import { motion } from 'framer-motion';

const KpiCard = ({ value, label, sub, icon: Icon, color = 'indigo', index = 0 }) => {
  const colorMap = {
    indigo: { color: 'var(--indigo-500)', bg: 'var(--indigo-50)' },
    emerald: { color: 'var(--emerald-500)', bg: 'var(--emerald-50)' },
    amber: { color: 'var(--amber-500)', bg: 'var(--amber-50)' },
    cyan: { color: 'var(--cyan-500)', bg: 'var(--cyan-50)' },
    rose: { color: 'var(--rose-500)', bg: 'var(--rose-50)' },
    violet: { color: 'var(--violet-500)', bg: '#f5f3ff' },
  };
  const c = colorMap[color] || colorMap.indigo;

  return (
    <motion.div
      className="kpi-card"
      style={{ '--kpi-color': c.color, '--kpi-bg': c.bg }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      {Icon && (
        <div className="kpi-icon">
          <Icon size={18} />
        </div>
      )}
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </motion.div>
  );
};

export default KpiCard;
