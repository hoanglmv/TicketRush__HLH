import { motion } from 'framer-motion';

export default function SkeletonEventCard() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 w-full h-[360px] flex flex-col"
    >
      <div className="w-full h-40 bg-gray-200 rounded-t-2xl -mx-4 -mt-4 mb-4 animate-[pulse_1.5s_ease-in-out_infinite]" style={{ width: 'calc(100% + 32px)' }}></div>
      <div className="w-3/4 h-6 bg-gray-200 rounded mb-4 animate-[pulse_1.5s_ease-in-out_infinite_0.1s]"></div>
      <div className="w-full h-4 bg-gray-200 rounded mb-2 animate-[pulse_1.5s_ease-in-out_infinite_0.2s]"></div>
      <div className="w-1/2 h-4 bg-gray-200 rounded mb-auto animate-[pulse_1.5s_ease-in-out_infinite_0.3s]"></div>
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <div className="w-16 h-6 bg-gray-200 rounded-full animate-[pulse_1.5s_ease-in-out_infinite_0.4s]"></div>
        <div className="w-20 h-4 bg-gray-200 rounded animate-[pulse_1.5s_ease-in-out_infinite_0.5s]"></div>
      </div>
    </motion.div>
  );
}
