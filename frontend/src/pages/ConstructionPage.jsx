import React from 'react';
import { motion } from 'framer-motion';
import { Wrench, Construction } from 'lucide-react';

const ConstructionPage = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-center p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-12 max-w-lg w-full flex flex-col items-center border border-white/5"
      >
        <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
          <Construction size={40} className="text-blue-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">{title}</h2>
        <p className="text-slate-400 mb-8 max-w-sm">
          This module is currently under active development. Check back soon for the release.
        </p>
        <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium">
          Notify Me When Live
        </button>
      </motion.div>
    </div>
  );
};

export default ConstructionPage;
