import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventListPage from './pages/EventListPage';
import EventDetailPage from './pages/EventDetailPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import CheckoutPage from './pages/CheckoutPage';
import WaitingRoomPage from './pages/WaitingRoomPage';
import MyTicketsPage from './pages/MyTicketsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminEventListPage from './pages/admin/AdminEventListPage';
import AdminEventCreatePage from './pages/admin/AdminEventCreatePage';
import AdminEventDetailPage from './pages/admin/AdminEventDetailPage';
import './index.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/events" element={<EventListPage />} />
      <Route path="/events/:id" element={<EventDetailPage />} />
      <Route path="/events/:id/seats" element={<ProtectedRoute><SeatSelectionPage /></ProtectedRoute>} />
      <Route path="/events/:eventId/queue" element={<ProtectedRoute><WaitingRoomPage /></ProtectedRoute>} />
      <Route path="/checkout/:ticketId" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
      <Route path="/tickets" element={<ProtectedRoute><MyTicketsPage /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
      <Route path="/admin/events" element={<AdminRoute><AdminEventListPage /></AdminRoute>} />
      <Route path="/admin/events/create" element={<AdminRoute><AdminEventCreatePage /></AdminRoute>} />
      <Route path="/admin/events/:id" element={<AdminRoute><AdminEventDetailPage /></AdminRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
