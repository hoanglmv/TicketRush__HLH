import { motion } from 'framer-motion';

export default function SkeletonEventCard() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="skeleton-card"
    >
      <div className="skeleton skeleton-banner" style={{ margin: '-16px -16px 16px -16px', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}></div>
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
      <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <div className="skeleton" style={{ width: '60px', height: '24px', borderRadius: '20px' }}></div>
        <div className="skeleton" style={{ width: '80px', height: '16px' }}></div>
      </div>
    </motion.div>
  );
}
