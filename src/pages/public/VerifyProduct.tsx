import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, ShieldCheck, ArrowRight, Camera } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import { qrCodes } from '../../data/qrMockData';
import { useTranslation } from 'react-i18next';

export function VerifyProduct() {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [method, setMethod] = useState<'camera' | 'manual'>('camera');
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!code) {
      addToast({ type: 'error', title: t('error'), message: t('verify_error_no_code') });
      return;
    }
    navigate(`/trace/${code}`);
  };

  const mockScan = () => {
    setIsScanning(true);
    addToast({ type: 'info', title: t('opening_camera'), message: t('camera_simulation') });
    setTimeout(() => {
      // Pick a random QR ID to demo
      const randomQr = qrCodes[Math.floor(Math.random() * qrCodes.length)].code;
      setCode(randomQr);
      setIsScanning(false);
      addToast({ type: 'success', title: t('scan_complete'), message: t('qr_detected', { code: randomQr }) });
      // auto submit after small delay
      setTimeout(() => navigate(`/trace/${randomQr}`), 1000);
    }, 2000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-20 px-4">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-viet-red text-white flex items-center justify-center rounded-2xl mx-auto shadow-lg shadow-red-900/20">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t('verify_title')}</h1>
          <p className="text-slate-500 font-medium">{t('verify_subtitle')}</p>
        </div>

        <div className="card p-8 bg-white border border-slate-200">
          <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
            <button 
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${method === 'camera' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setMethod('camera')}
            >
              {t('scan_camera_btn')}
            </button>
            <button 
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${method === 'manual' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setMethod('manual')}
            >
              {t('manual_entry_btn')}
            </button>
          </div>

          {method === 'camera' ? (
            <div className="space-y-6">
              <div className="aspect-square bg-slate-900 rounded-2xl overflow-hidden relative flex flex-col items-center justify-center border-4 border-slate-200">
                {isScanning ? (
                  <div className="absolute inset-0 border-4 border-viet-red rounded-xl opacity-50 m-12 animate-pulse" />
                ) : (
                  <>
                    <Camera size={48} className="text-slate-600 mb-4" />
                    <p className="text-slate-400 text-sm font-medium">{t('camera_placeholder')}</p>
                  </>
                )}
                
                {/* Scanner laser overlay mock */}
                {isScanning && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-viet-red shadow-[0_0_15px_#ff0000] animate-[scanner_2s_ease-in-out_infinite]" />
                )}
              </div>
              <button 
                className="btn-primary w-full justify-center text-lg py-4 shadow-xl shadow-red-900/20"
                onClick={mockScan}
                disabled={isScanning}
              >
                {isScanning ? t('recognizing') : t('open_camera_scan')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="space-y-2">
                <label className="input-label">{t('qr_code_label')}</label>
                <div className="relative">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={t('qr_code_placeholder')}
                    className="input py-4 pl-12 font-mono text-lg font-bold tracking-wider"
                  />
                  <QrCode size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <p className="input-helper">{t('qr_code_helper')}</p>
              </div>
              
              <button type="submit" className="btn-primary w-full justify-center flex items-center gap-2 py-4">
                {t('verify_now')} <ArrowRight size={20} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
