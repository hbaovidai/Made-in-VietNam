import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { TradeMessenger } from '../components/TradeMessage';

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {/* Public B2B Negotiation Chat / Trade Messenger */}
      <TradeMessenger />
    </div>
  );
}
