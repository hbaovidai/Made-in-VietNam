import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Send, ShoppingCart, ChevronRight, Store, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { products, suppliers } from '../data/mockData';

export function InquiryBasket() {
  const { t } = useTranslation();
  // Mock basket data using existing mock products
  const [basketItems, setBasketItems] = React.useState([
    {
      ...products[0],
      supplier: suppliers.find(s => s.id === products[0].supplierId)
    },
    {
      ...products[2],
      supplier: suppliers.find(s => s.id === products[2].supplierId)
    }
  ]);

  const removeItem = (id: string) => {
    setBasketItems(prev => prev.filter(item => item.id !== id));
  };

  if (basketItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart size={48} className="text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('basket_empty_title')}</h2>
        <p className="text-slate-500 mb-8">{t('basket_empty_desc')}</p>
        <Link to="/products" className="inline-block bg-viet-red text-white px-8 py-3 font-bold hover:bg-red-700 transition-all">
          {t('browse_products')}
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link to="/" className="hover:text-viet-red">{t('home')}</Link>
          <ChevronRight size={14} />
          <span className="text-slate-900 font-medium">{t('inquiry_basket')}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white border border-slate-200 shadow-sm rounded-sm">
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                <h1 className="text-xl font-bold text-slate-900">{t('inquiry_basket')} ({basketItems.length})</h1>
                <button className="text-sm text-slate-500 hover:text-viet-red font-medium">{t('clear_all')}</button>
              </div>

              <div className="divide-y divide-slate-100">
                {basketItems.map((item) => (
                  <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-slate-50/30 transition-colors">
                    <div className="w-32 h-32 bg-slate-100 border border-slate-200 shrink-0 overflow-hidden rounded-sm">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <Link to={`/products/${item.id}`} className="text-lg font-bold text-slate-900 hover:text-viet-red line-clamp-2">
                        {item.name}
                      </Link>
                      
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Store size={14} className="text-slate-400" />
                          <Link to={`/suppliers/${item.supplier?.id}`} className="hover:text-viet-red font-medium">
                            {item.supplier?.name}
                          </Link>
                          {item.supplier?.isVerified && (
                            <span className="bg-emerald-50 text-emerald-600 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border border-emerald-100">
                              {t('verified')}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Package size={14} className="text-slate-400" />
                          <span>{t('moq')}: {item.moq}</span>
                        </div>
                      </div>

                      <div className="pt-4 flex items-center gap-4">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                          <span>{t('remove')}</span>
                        </button>
                        <div className="h-4 w-px bg-slate-200" />
                        <button className="flex items-center gap-1.5 text-sm text-viet-red font-bold hover:text-red-700 transition-colors">
                          <Send size={16} />
                          <span>{t('send_inquiry')}</span>
                        </button>
                      </div>
                    </div>

                    <div className="sm:w-40 flex flex-col justify-between items-end">
                      <div className="text-right">
                        <div className="text-lg font-bold text-viet-red">{item.priceRange}</div>
                        <div className="text-xs text-slate-400 mt-1">{t('fob_price')}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:w-80 space-y-6">
            <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-sm">
              <h3 className="font-bold text-slate-900 mb-4">{t('inquiry_summary')}</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>{t('selected_products')}</span>
                  <span className="font-bold">{basketItems.length}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>{t('selected_suppliers')}</span>
                  <span className="font-bold">{new Set(basketItems.map(i => i.supplierId)).size}</span>
                </div>
              </div>
              
              <div className="bg-red-50 p-4 border border-red-100 mb-6">
                <p className="text-xs text-red-800 leading-relaxed">
                  <strong>{t('tip')}</strong> {t('basket_tip_desc')}
                </p>
              </div>

              <button className="w-full bg-viet-red text-white py-3 font-bold hover:bg-red-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                <Send size={18} />
                {t('send_all_inquiries')}
              </button>
            </div>

            <div className="bg-slate-100 p-6 rounded-sm border border-slate-200">
              <h4 className="font-bold text-slate-800 text-sm mb-2">{t('need_help')}</h4>
              <p className="text-xs text-slate-500 mb-4">{t('sourcing_experts_desc')}</p>
              <Link to="/contact" className="text-xs font-bold text-viet-red hover:underline">{t('contact_sourcing_support')}</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
