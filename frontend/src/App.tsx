import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { WPAdminLayout } from './layouts/WPAdminLayout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppearanceProvider } from './contexts/AppearanceContext';
import { ThemeEffects } from './components/ThemeEffects';
import { PromoPopup } from './components/PromoPopup';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AdminLogin } from './pages/AdminLogin';
import { ProfileSubmission } from './pages/ProfileSubmission';

// ============================================================
// Lazy-loaded Pages (Code Splitting)
// Mỗi trang sẽ chỉ được tải khi người dùng navigate tới
// ============================================================

// Main Public Pages
const Home = React.lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const UITest = React.lazy(() => import('./pages/UITest').then(m => ({ default: m.UITest })));
const ProductListing = React.lazy(() => import('./pages/ProductListing').then(m => ({ default: m.ProductListing })));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail').then(m => ({ default: m.ProductDetail })));
const SupplierList = React.lazy(() => import('./pages/SupplierList').then(m => ({ default: m.SupplierList })));
const SupplierProfile = React.lazy(() => import('./pages/SupplierProfile').then(m => ({ default: m.SupplierProfile })));
const RFQ = React.lazy(() => import('./pages/RFQ').then(m => ({ default: m.RFQ })));
const About = React.lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Contact = React.lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const Cart = React.lazy(() => import('./pages/Cart').then(m => ({ default: m.Cart })));
const Checkout = React.lazy(() => import('./pages/Checkout').then(m => ({ default: m.Checkout })));
const NotFound = React.lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));
const Reports = React.lazy(() => import('./pages/Reports').then(m => ({ default: m.Reports })));
const Apps = React.lazy(() => import('./pages/Apps').then(m => ({ default: m.Apps })));
const Blog = React.lazy(() => import('./pages/Blog').then(m => ({ default: m.Blog })));
const Careers = React.lazy(() => import('./pages/Careers').then(m => ({ default: m.Careers })));
const SearchResults = React.lazy(() => import('./pages/SearchResults').then(m => ({ default: m.SearchResults })));

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
const BuyerOrders = React.lazy(() => import('./pages/dashboard/buyer/BuyerOrders').then(m => ({ default: m.BuyerOrders })));
const BuyerMessages = React.lazy(() => import('./pages/dashboard/buyer/BuyerMessages').then(m => ({ default: m.BuyerMessages })));
const BuyerHistory = React.lazy(() => import('./pages/dashboard/buyer/BuyerHistory').then(m => ({ default: m.BuyerHistory })));
const BuyerAnalytics = React.lazy(() => import('./pages/dashboard/buyer/BuyerAnalytics').then(m => ({ default: m.BuyerAnalytics })));
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
const SupplierOrders = React.lazy(() => import('./pages/dashboard/supplier/SupplierOrders').then(m => ({ default: m.SupplierOrders })));
const SupplierAnalytics = React.lazy(() => import('./pages/dashboard/supplier/SupplierAnalytics').then(m => ({ default: m.SupplierAnalytics })));
const SupplierProfileDashboard = React.lazy(() => import('./pages/dashboard/supplier/SupplierProfile').then(m => ({ default: m.SupplierProfile })));
const SupplierSettings = React.lazy(() => import('./pages/dashboard/supplier/SupplierSettings').then(m => ({ default: m.SupplierSettings })));
const ManufacturerVerification = React.lazy(() => import('./pages/dashboard/supplier/ManufacturerVerification').then(m => ({ default: m.ManufacturerVerification })));

// Admin Lazy Pages
const AdminOverview = React.lazy(() => import('./pages/dashboard/admin/AdminOverview').then(m => ({ default: m.AdminOverview })));
const AdminUsers = React.lazy(() => import('./pages/dashboard/admin/AdminUsers').then(m => ({ default: m.AdminUsers })));
const AdminAddUser = React.lazy(() => import('./pages/dashboard/admin/AdminAddUser').then(m => ({ default: m.AdminAddUser })));
const AdminUserProfile = React.lazy(() => import('./pages/dashboard/admin/AdminUserProfile').then(m => ({ default: m.AdminUserProfile })));
const AdminSuppliers = React.lazy(() => import('./pages/dashboard/admin/AdminSuppliers').then(m => ({ default: m.AdminSuppliers })));
const AdminProducts = React.lazy(() => import('./pages/dashboard/admin/AdminProducts').then(m => ({ default: m.AdminProducts })));
const AdminProductApproval = React.lazy(() => import('./pages/dashboard/admin/AdminProductApproval').then(m => ({ default: m.AdminProductApproval })));
const AdminBrands = React.lazy(() => import('./pages/dashboard/admin/AdminBrands').then(m => ({ default: m.AdminBrands })));
const AdminAttributes = React.lazy(() => import('./pages/dashboard/admin/AdminAttributes').then(m => ({ default: m.AdminAttributes })));
const AdminReviews = React.lazy(() => import('./pages/dashboard/admin/AdminReviews').then(m => ({ default: m.AdminReviews })));
const AdminCategories = React.lazy(() => import('./pages/dashboard/admin/AdminCategories').then(m => ({ default: m.AdminCategories })));
const AdminContacts = React.lazy(() => import('./pages/dashboard/admin/AdminContacts').then(m => ({ default: m.AdminContacts })));
const AdminComplaints = React.lazy(() => import('./pages/dashboard/admin/AdminComplaints').then(m => ({ default: m.AdminComplaints })));
const AdminOrders = React.lazy(() => import('./pages/dashboard/admin/AdminOrders').then(m => ({ default: m.AdminOrders })));
const AdminAuditLog = React.lazy(() => import('./pages/dashboard/admin/AdminAuditLog').then(m => ({ default: m.AdminAuditLog })));
const AdminSettings = React.lazy(() => import('./pages/dashboard/admin/AdminSettings').then(m => ({ default: m.AdminSettings })));
const AdminPages = React.lazy(() => import('./pages/dashboard/admin/AdminPages').then(m => ({ default: m.AdminPages })));
const AdminRequests = React.lazy(() => import('./pages/dashboard/admin/AdminRequests').then(m => ({ default: m.AdminRequests })));
const AdminMessages = React.lazy(() => import('./pages/dashboard/admin/AdminMessages').then(m => ({ default: m.AdminMessages })));

const AdminPendingProfiles = React.lazy(() => import('./pages/dashboard/admin/AdminPendingProfiles').then(m => ({ default: m.AdminPendingProfiles })));
const AdminVerificationRequests = React.lazy(() => import('./pages/dashboard/admin/AdminVerificationRequests').then(m => ({ default: m.AdminVerificationRequests })));
const AdminAppearance = React.lazy(() => import('./pages/dashboard/admin/AdminAppearance').then(m => ({ default: m.AdminAppearance })));
const AdminBlogPosts = React.lazy(() => import('./pages/dashboard/admin/AdminBlogPosts').then(m => ({ default: m.AdminBlogPosts })));
const AdminBlogCategories = React.lazy(() => import('./pages/dashboard/admin/AdminBlogCategories').then(m => ({ default: m.AdminBlogCategories })));
const AdminBlogSettings = React.lazy(() => import('./pages/dashboard/admin/AdminBlogSettings').then(m => ({ default: m.AdminBlogSettings })));
const AdminCareers = React.lazy(() => import('./pages/dashboard/admin/AdminCareers').then(m => ({ default: m.AdminCareers })));
const AdminLegal = React.lazy(() => import('./pages/dashboard/admin/AdminLegal').then(m => ({ default: m.AdminLegal })));
const AdminPrivacy = React.lazy(() => import('./pages/dashboard/admin/AdminPrivacy').then(m => ({ default: m.AdminPrivacy })));
const AdminAddSupplierProfile = React.lazy(() => import('./pages/dashboard/admin/AdminAddSupplierProfile').then(m => ({ default: m.AdminAppSupplier })));

// Upgrade form pages
const UpgradeFormExporter = React.lazy(() => import('./pages/UpgradeForms/Exporter').then(m => ({default: m.UpgradeFormExporter})));
const UpgradeFormManufacturer = React.lazy(() => import('./pages/UpgradeForms/Manufacturer').then(m => ({default: m.UpgradeFormManufacturer})));

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

// Redirect authenticated users away from auth pages
function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user) {
    const role = user.role?.toLowerCase();
    if (role === 'admin') return <Navigate to="/dashboard/admin" replace />;
    if (role === 'supplier') return <Navigate to="/dashboard/supplier" replace />;
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

// Redirect /admin or /wp-admin: if logged in as admin go to dashboard, else go to wp-login
function AdminRedirect() {
  const { user } = useAuth();
  if (user && user.role === 'ADMIN') return <Navigate to="/dashboard/admin" replace />;
  return <Navigate to="/wp-login?redirect_to=/dashboard/admin" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppearanceProvider>
      <BrowserRouter>
        <ErrorBoundary>
        <ScrollToTop />
        <ThemeEffects />
        <PromoPopup />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Main Public Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/ui-test" element={<UITest />} />
              <Route path="/products" element={<ProductListing />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/suppliers" element={<SupplierList />} />
              <Route path="/suppliers/:id" element={<SupplierProfile />} />
              <Route path="/rfq" element={<RFQ />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* New Public Routes */}
              <Route path="/reports" element={<Reports />} />
              {/*<Route path="/apps" element={<Apps />} />*/}
              {/* <Route path="/premium" element={<Membership />} /> */}
              <Route path="/services" element={<TradeAssurance />} />
              <Route path="/services/trade-assurance" element={<TradeAssurance />} />
              {/* <Route path="/services/membership" element={<Membership />} /> */}
              <Route path="/services/secured-trading" element={<SecuredTrading />} />

              <Route path="/help" element={<HelpCenter />} />
              <Route path="/help/seller-guide" element={<SellerGuide />} />
              <Route path="/help/user-guide" element={<UserGuide />} />

              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/search" element={<SearchResults />} />

              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Standalone Auth Routes — redirect if already logged in */}
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/wp-login" element={<GuestRoute><AdminLogin /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
            <Route path="/profile-submission" element={<ProfileSubmission />} />

            {/* upgrade forms */}
            <Route path='/upgrade-forms/exporter' element={<UpgradeFormExporter/>}/>
            <Route path='/upgrade-forms/manufacturer' element={<UpgradeFormManufacturer/>}/>

            {/* Dashboard Root Redirect */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            } />

            {/* Admin Shortcuts (like WordPress) — redirect to dashboard if already admin */}
            <Route path="/admin" element={<AdminRedirect />} />
            <Route path="/wp-admin" element={<AdminRedirect />} />

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
              <Route path="analytics" element={<BuyerAnalytics />} />
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
              <Route path="rfqs" element={<SupplierRFQs />} />
              <Route path="inquiries" element={<SupplierInquiries />} />
              <Route path="messages" element={<BuyerMessages />} />
              <Route path="analytics" element={<SupplierAnalytics />} />
              <Route path="profile" element={<SupplierProfileDashboard />} />
              <Route path="settings" element={<SupplierSettings />} />
              <Route path="verification/manufacturer" element={<ManufacturerVerification />} />
            </Route>

            <Route path="/dashboard/admin" element={
              <ProtectedRoute>
                <WPAdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminOverview />} />
              <Route path="pages" element={<AdminPages />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="users/add" element={<AdminAddUser />} />
              <Route path="profile" element={<AdminUserProfile />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/approve/:id" element={<AdminProductApproval />} />
              <Route path="products/brands" element={<AdminBrands />} />
              <Route path="products/attributes" element={<AdminAttributes />} />
              <Route path="products/reviews" element={<AdminReviews />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="complaints" element={<AdminComplaints />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="audit-log" element={<AdminAuditLog />} />
              <Route path="requests" element={<AdminRequests />} />
              <Route path="messages" element={<AdminMessages />} />

              <Route path="suppliers/verified" element={<AdminSuppliers />} />
              <Route path="suppliers/pending-profiles" element={<AdminPendingProfiles />} />
              <Route path="suppliers/verification-requests" element={<AdminVerificationRequests />} />
              <Route path="suppliers/add-fake-profiles" element={<AdminAddSupplierProfile/>}/>

              <Route path="settings" element={<AdminSettings />} />
              <Route path="appearance" element={<AdminAppearance />} />
              <Route path="blog/posts" element={<AdminBlogPosts />} />
              <Route path="blog/categories" element={<AdminBlogCategories />} />
              <Route path="blog/settings" element={<AdminBlogSettings />} />
              <Route path="careers" element={<AdminCareers />} />
              <Route path="legal" element={<AdminLegal />} />
              <Route path="legal/privacy" element={<AdminPrivacy />} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
      </BrowserRouter>
      </AppearanceProvider>
    </AuthProvider>
  );
}
