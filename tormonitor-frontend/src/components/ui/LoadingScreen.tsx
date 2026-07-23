import { motion } from 'motion/react';

export function LoadingScreen() {
  return (
    <motion.div 
      className="fixed inset-0 bg-cream z-50 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center gap-6">
        <motion.div 
          className="w-16 h-16 rounded-full bg-forest text-cream flex items-center justify-center font-display font-bold text-3xl shadow-xl relative overflow-hidden"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <motion.div
            className="absolute inset-0 bg-terracotta/40"
            initial={{ y: "100%" }}
            animate={{ y: "-100%" }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
          <span className="relative z-10">T</span>
        </motion.div>
        
        <motion.div 
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="font-display font-bold text-2xl text-forest tracking-tight">TorMonitor</h1>
          <div className="flex gap-1.5 mt-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-terracotta"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.5, 
                  delay: i * 0.2,
                  ease: "easeInOut" 
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
