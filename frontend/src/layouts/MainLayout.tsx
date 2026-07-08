import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { TradeMessenger } from '../components/TradeMessage';
import { motion, AnimatePresence } from 'motion/react';

export function MainLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      {/* Public B2B Negotiation Chat / Trade Messenger */}
      <TradeMessenger />
    </div>
  );
}
