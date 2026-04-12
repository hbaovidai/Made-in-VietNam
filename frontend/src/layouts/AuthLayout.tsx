import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  rightActionText: string;
  rightActionLink: string;
}

export function AuthLayout({ children, rightActionText, rightActionLink }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Header */}
      <header className="w-full px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1">
          <img src="/logoVIE.png" alt="Logo" className="h-14 w-auto object-contain mix-blend-multiply" />
          <span className="text-xl font-black text-slate-800 tracking-tight">VIE<span className="text-primary">Product</span></span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/help" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
            Help
          </Link>
          <Link
            to={rightActionLink}
            className="bg-[#0F172A] hover:bg-[#1E293B] text-white text-sm font-bold px-6 py-2.5 rounded-md transition-colors"
          >
            {rightActionText}
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-6 flex flex-col md:flex-row items-center justify-between border-t border-slate-200/60 mt-auto text-xs text-slate-500">
        <div className="mb-4 md:mb-0">
          <span className="font-bold text-slate-700 text-sm">VIEProduct</span>
          <span className="ml-2">© 2024 VIEProduct. Vietnamese Industrial Excellence.</span>
        </div>
        <div className="flex items-center gap-6 font-medium">
          <Link to="/privacy" className="hover:text-slate-800 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-slate-800 transition-colors">Terms of Service</Link>
          <Link to="/contact" className="hover:text-slate-800 transition-colors">Contact Support</Link>
          <Link to="/verify" className="hover:text-slate-800 transition-colors">Manufacturer Verification</Link>
        </div>
      </footer>
    </div>
  );
}
