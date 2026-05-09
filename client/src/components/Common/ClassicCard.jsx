import React from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
};

export default function ClassicCard({ feature, index }) {
  return (
    <motion.div
      initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={index}
      className="classic-card"
    >
      <div className="classic-content" style={{ padding: '64px 48px', height: '100%' }}>
        <div className="icon-wrapper" style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--color-surface-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px' }}>
          {feature.icon}
        </div>
        <h3 style={{ fontSize: '20px', marginBottom: '16px', fontWeight: '600', letterSpacing: '-0.5px' }}>{feature.title}</h3>
        <p style={{ color: 'var(--color-muted)', lineHeight: '1.6', fontSize: '15px' }}>{feature.desc}</p>
        
        <div style={{ marginTop: '32px', height: '1px', width: '32px', background: 'var(--color-border)', transition: 'width 0.3s ease' }} className="hover-line" />
      </div>
    </motion.div>
  );
}
