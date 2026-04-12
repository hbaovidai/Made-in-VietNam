import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// ============================================================
// Lazy-loaded Pages (Code Splitting)
// Mỗi trang sẽ chỉ được tải khi người dùng navigate tới
// ============================================================

// Main Public Pages
// Main Public Pages
const Home = React.lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const UITest = React.lazy(() => import('./pages/UITest').then(m => ({ default: m.UITest })));
const VerifyProduct = React.lazy(() => import('./pages/public/VerifyProduct').then(m => ({ default: m.VerifyProduct })));
const ProductTrace = React.lazy(() => import('./pages/public/ProductTrace').then(m => ({ default: m.ProductTrace })));
const ProductListing = React.lazy(() => import('./pages/ProductListing').then(m => ({ default: m.ProductListing })));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail').then(m => ({ default: m.ProductDetail })));
const SupplierList = React.lazy(() => import('./pages/SupplierList').then(m => ({ default: m.SupplierList })));
const SupplierProfile = React.lazy(() => import('./pages/SupplierProfile').then(m => ({ default: m.SupplierProfile })));
const RFQ = React.lazy(() => import('./pages/RFQ').then(m => ({ default: m.RFQ })));
const AboutContact = React.lazy(() => import('./pages/AboutContact').then(m => ({ default: m.AboutContact })));
const InquiryBasket = React.lazy(() => import('./pages/InquiryBasket').then(m => ({ default: m.InquiryBasket })));
const NotFound = React.lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));
const Reports = React.lazy(() => import('./pages/Reports').then(m => ({ default: m.Reports })));
const Apps = React.lazy(() => import('./pages/Apps').then(m => ({ default: m.Apps })));

// Support Pages
const HelpCenter = React.lazy(() => import('./pages/support/HelpCenter').then(m => ({ default: m.HelpCenter })));
const SellerGuide = React.lazy(() => import('./pages/support/SellerGuide').then(m => ({ default: m.SellerGuide })));
const UserGuide = React.lazy(() => import('./pages/support/UserGuide').then(m => ({ default: m.UserGuide })));

// Service Pages
const TradeAssurance = React.lazy(() => import('./pages/services/TradeAssurance').then(m => ({ default: m.TradeAssurance })));
const SecuredTrading = React.lazy(() => import('./pages/services/SecuredTrading').then(m => ({ default: m.SecuredTrading })));
const Membership = React.lazy(() => import('./pages/services/Membership').then(m => ({ default: m.Membership })));

// Legal Pages
const PrivacyPolicy = React.lazy(() => import('./pages/legal/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = React.lazy(() => import('./pages/legal/TermsOfService').then(m => ({ default: m.TermsOfService })));

// Dashboard Pages - Buyer
const BuyerOverview = React.lazy(() => import('./pages/dashboard/buyer/BuyerOverview').then(m => ({ default: m.BuyerOverview })));
const BuyerRFQs = React.lazy(() => import('./pages/dashboard/buyer/BuyerRFQs').then(m => ({ default: m.BuyerRFQs })));
const BuyerSaved = React.lazy(() => import('./pages/dashboard/buyer/BuyerSaved').then(m => ({ default: m.BuyerSaved })));
const BuyerMessages = React.lazy(() => import('./pages/dashboard/buyer/BuyerMessages').then(m => ({ default: m.BuyerMessages })));
const BuyerHistory = React.lazy(() => import('./pages/dashboard/buyer/BuyerHistory').then(m => ({ default: m.BuyerHistory })));
const BuyerSettings = React.lazy(() => import('./pages/dashboard/buyer/BuyerSettings').then(m => ({ default: m.BuyerSettings })));

// Dashboard Pages - Supplier
const SupplierOverview = React.lazy(() => import('./pages/dashboard/supplier/SupplierOverview').then(m => ({ default: m.SupplierOverview })));
const SupplierProducts = React.lazy(() => import('./pages/dashboard/supplier/SupplierProducts').then(m => ({ default: m.SupplierProducts })));
const ProductFormPage = React.lazy(() => import('./pages/dashboard/supplier/ProductFormPage').then(m => ({ default: m.ProductFormPage })));
const BatchManagement = React.lazy(() => import('./pages/dashboard/supplier/BatchManagement').then(m => ({ default: m.BatchManagement })));
const QRManagement = React.lazy(() => import('./pages/dashboard/supplier/QRManagement').then(m => ({ default: m.QRManagement })));
const AntiCounterfeit = React.lazy(() => import('./pages/dashboard/supplier/AntiCounterfeit').then(m => ({ default: m.AntiCounterfeit })));
const SupplierRFQs = React.lazy(() => import('./pages/dashboard/supplier/SupplierRFQs').then(m => ({ default: m.SupplierRFQs })));
const SupplierInquiries = React.lazy(() => import('./pages/dashboard/supplier/SupplierInquiries').then(m => ({ default: m.SupplierInquiries })));
const SupplierAnalytics = React.lazy(() => import('./pages/dashboard/supplier/SupplierAnalytics').then(m => ({ default: m.SupplierAnalytics })));
const SupplierProfileDashboard = React.lazy(() => import('./pages/dashboard/supplier/SupplierProfile').then(m => ({ default: m.SupplierProfile })));
const SupplierSettings = React.lazy(() => import('./pages/dashboard/supplier/SupplierSettings').then(m => ({ default: m.SupplierSettings })));

// Admin Lazy Pages
const AdminOverview = React.lazy(() => import('./pages/dashboard/admin/AdminOverview').then(m => ({ default: m.AdminOverview })));
const AdminUsers = React.lazy(() => import('./pages/dashboard/admin/AdminUsers').then(m => ({ default: m.AdminUsers })));
const AdminSuppliers = React.lazy(() => import('./pages/dashboard/admin/AdminSuppliers').then(m => ({ default: m.AdminSuppliers })));
const AdminProducts = React.lazy(() => import('./pages/dashboard/admin/AdminProducts').then(m => ({ default: m.AdminProducts })));

// Redirect base dashboard based on role
function DashboardRedirect() {
  const { user } = useAuth();
  if (!user) return null;
  return <React.Suspense fallback={<PageLoader />}><React.Fragment>
    {React.createElement(
      React.lazy(() => import('react-router-dom').then(m => ({ default: m.Navigate }))),
      { to: `/dashboard/${user.role.toLowerCase()}`, replace: true }
    )}
  </React.Fragment></React.Suspense>;
}

// ============================================================
// Loading Spinner - hiển thị khi lazy component đang tải
// ============================================================
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
        <span className="text-sm text-slate-500 font-medium">Đang tải...</span>
      </div>
    </div>
  );
}

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
    <AuthProvider>
      <BrowserRouter>
        <ErrorBoundary>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Main Public Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/ui-test" element={<UITest />} />
              <Route path="/verify" element={<VerifyProduct />} />
              <Route path="/trace/:code" element={<ProductTrace />} />
              <Route path="/products" element={<ProductListing />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/suppliers" element={<SupplierList />} />
              <Route path="/suppliers/:id" element={<SupplierProfile />} />
              <Route path="/rfq" element={<RFQ />} />
              <Route path="/inquiry-basket" element={<InquiryBasket />} />
              <Route path="/about" element={<AboutContact />} />
              <Route path="/contact" element={<AboutContact />} />

              {/* New Public Routes */}
              <Route path="/reports" element={<Reports />} />
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

            {/* Standalone Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Dashboard Root Redirect */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            } />

            {/* Dashboard Routes - Protected */}
            <Route path="/dashboard/buyer" element={
              <ProtectedRoute>
                <DashboardLayout type="buyer" />
              </ProtectedRoute>
            }>
              <Route index element={<BuyerOverview />} />
              <Route path="rfqs" element={<BuyerRFQs />} />
              <Route path="saved" element={<BuyerSaved />} />
              <Route path="messages" element={<BuyerMessages />} />
              <Route path="history" element={<BuyerHistory />} />
              <Route path="settings" element={<BuyerSettings />} />
            </Route>

            <Route path="/dashboard/supplier" element={
              <ProtectedRoute>
                <DashboardLayout type="supplier" />
              </ProtectedRoute>
            }>
              <Route index element={<SupplierOverview />} />
              <Route path="products" element={<SupplierProducts />} />
              <Route path="products/add" element={<ProductFormPage />} />
              <Route path="products/:id/edit" element={<ProductFormPage />} />
              <Route path="batches" element={<BatchManagement />} />
              <Route path="qr-management" element={<QRManagement />} />
              <Route path="anti-counterfeit" element={<AntiCounterfeit />} />
              <Route path="rfqs" element={<SupplierRFQs />} />
              <Route path="inquiries" element={<SupplierInquiries />} />
              <Route path="messages" element={<BuyerMessages />} />
              <Route path="analytics" element={<SupplierAnalytics />} />
              <Route path="profile" element={<SupplierProfileDashboard />} />
              <Route path="settings" element={<SupplierSettings />} />
            </Route>

            <Route path="/dashboard/admin" element={
              <ProtectedRoute>
                <DashboardLayout type="admin" />
              </ProtectedRoute>
            }>
              <Route index element={<AdminOverview />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="suppliers" element={<AdminSuppliers />} />
              <Route path="products" element={<AdminProducts />} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );
}
