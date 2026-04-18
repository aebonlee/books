import { lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { CartProvider } from './contexts/CartContext';
import PublicLayout from './layouts/PublicLayout';
import AuthGuard from './components/AuthGuard';
import type { ReactElement } from 'react';

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'));
const EPublishing = lazy(() => import('./pages/EPublishing'));
const Catalog = lazy(() => import('./pages/Catalog'));
const Category = lazy(() => import('./pages/Category'));
const BookDetail = lazy(() => import('./pages/BookDetail'));
const Reader = lazy(() => import('./pages/Reader'));
const Library = lazy(() => import('./pages/Library'));
const Reports = lazy(() => import('./pages/Reports'));
const ReportDetail = lazy(() => import('./pages/ReportDetail'));
const Learning = lazy(() => import('./pages/Learning'));
const CustomOrder = lazy(() => import('./pages/CustomOrder'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const CheckoutSuccess = lazy(() => import('./pages/CheckoutSuccess'));
const Login = lazy(() => import('./pages/Login'));
const AdminMembers = lazy(() => import('./pages/admin/AdminMembers'));
const AdminGallery = lazy(() => import('./pages/admin/AdminGallery'));
const AdminReports = lazy(() => import('./pages/admin/AdminReports'));
const AdminLearning = lazy(() => import('./pages/admin/AdminLearning'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App(): ReactElement {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <CartProvider>
              <Router>
                <Routes>
                  <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/e-publishing" element={<EPublishing />} />
                    <Route path="/catalog" element={<Catalog />} />
                    <Route path="/category/:category" element={<Category />} />
                    <Route path="/books/:slug" element={<BookDetail />} />
                    <Route path="/reader/:id" element={<Reader />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/reports/:id" element={<ReportDetail />} />
                    <Route path="/learning" element={<Learning />} />
                    <Route path="/custom-order" element={<CustomOrder />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/checkout/success" element={<CheckoutSuccess />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/library" element={
                      <AuthGuard><Library /></AuthGuard>
                    } />
                    <Route path="/admin/members" element={
                      <AuthGuard adminOnly><AdminMembers /></AuthGuard>
                    } />
                    <Route path="/admin/gallery" element={
                      <AuthGuard adminOnly><AdminGallery /></AuthGuard>
                    } />
                    <Route path="/admin/reports" element={
                      <AuthGuard adminOnly><AdminReports /></AuthGuard>
                    } />
                    <Route path="/admin/learning-content" element={
                      <AuthGuard adminOnly><AdminLearning /></AuthGuard>
                    } />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </Router>
            </CartProvider>
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
