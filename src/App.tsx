import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Home } from './pages/Home';
import { ProductListing } from './pages/ProductListing';
import { ProductDetail } from './pages/ProductDetail';
import { SupplierList } from './pages/SupplierList';
import { SupplierProfile } from './pages/SupplierProfile';
import { RFQ } from './pages/RFQ';
import { LoginRegister } from './pages/LoginRegister';
import { AboutContact } from './pages/AboutContact';
import { InquiryBasket } from './pages/InquiryBasket';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { CategoriesOverview } from './pages/CategoriesOverview';
import { NotFound } from './pages/NotFound';
import { VideoChannel } from './pages/VideoChannel';
import { Reports } from './pages/Reports';
import { Events } from './pages/Events';
import { Apps } from './pages/Apps';

// Support Pages
import { HelpCenter } from './pages/support/HelpCenter';
import { SellerGuide } from './pages/support/SellerGuide';
import { UserGuide } from './pages/support/UserGuide';

// Service Pages
import { TradeAssurance } from './pages/services/TradeAssurance';
import { SecuredTrading } from './pages/services/SecuredTrading';
import { Membership } from './pages/services/Membership';

// Legal Pages
import { PrivacyPolicy } from './pages/legal/PrivacyPolicy';
import { TermsOfService } from './pages/legal/TermsOfService';

// Dashboard Pages
import { BuyerOverview } from './pages/dashboard/buyer/BuyerOverview';
import { BuyerRFQs } from './pages/dashboard/buyer/BuyerRFQs';
import { BuyerSaved } from './pages/dashboard/buyer/BuyerSaved';
import { BuyerMessages } from './pages/dashboard/buyer/BuyerMessages';
import { BuyerHistory } from './pages/dashboard/buyer/BuyerHistory';
import { BuyerSettings } from './pages/dashboard/buyer/BuyerSettings';

import { SupplierOverview } from './pages/dashboard/supplier/SupplierOverview';
import { SupplierProducts } from './pages/dashboard/supplier/SupplierProducts';
import { SupplierRFQs } from './pages/dashboard/supplier/SupplierRFQs';
import { SupplierAnalytics } from './pages/dashboard/supplier/SupplierAnalytics';
import { SupplierProfile as SupplierProfileDashboard } from './pages/dashboard/supplier/SupplierProfile';
import { SupplierSettings } from './pages/dashboard/supplier/SupplierSettings';

// Scroll to top on navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Main Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/suppliers" element={<SupplierList />} />
          <Route path="/suppliers/:id" element={<SupplierProfile />} />
          <Route path="/rfq" element={<RFQ />} />
          <Route path="/categories" element={<CategoriesOverview />} />
          <Route path="/categories/:slug" element={<CategoryDetailPage />} />
          <Route path="/inquiry-basket" element={<InquiryBasket />} />
          <Route path="/about" element={<AboutContact />} />
          <Route path="/contact" element={<AboutContact />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/register" element={<LoginRegister />} />
          
          {/* New Public Routes */}
          <Route path="/video" element={<VideoChannel />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/events" element={<Events />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/premium" element={<Membership />} />
          <Route path="/services" element={<TradeAssurance />} />
          <Route path="/services/trade-assurance" element={<TradeAssurance />} />
          <Route path="/services/membership" element={<Membership />} />
          <Route path="/services/secured-trading" element={<SecuredTrading />} />
          
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/help/seller-guide" element={<SellerGuide />} />
          <Route path="/help/user-guide" element={<UserGuide />} />
          
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Dashboard Routes */}
        <Route path="/dashboard/buyer" element={<DashboardLayout type="buyer" />}>
          <Route index element={<BuyerOverview />} />
          <Route path="rfqs" element={<BuyerRFQs />} />
          <Route path="saved" element={<BuyerSaved />} />
          <Route path="messages" element={<BuyerMessages />} />
          <Route path="history" element={<BuyerHistory />} />
          <Route path="settings" element={<BuyerSettings />} />
        </Route>

        <Route path="/dashboard/supplier" element={<DashboardLayout type="supplier" />}>
          <Route index element={<SupplierOverview />} />
          <Route path="products" element={<SupplierProducts />} />
          <Route path="rfqs" element={<SupplierRFQs />} />
          <Route path="analytics" element={<SupplierAnalytics />} />
          <Route path="profile" element={<SupplierProfileDashboard />} />
          <Route path="settings" element={<SupplierSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
