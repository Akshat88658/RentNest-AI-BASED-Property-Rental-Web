import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// ── Pages ──────────────────────────────────────
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import BookProperty from './pages/BookProperty';
import Dashboard from './pages/Dashboard';
import CreateProperty from './pages/CreateProperty';
import MyBookings from './pages/MyBookings';
import AIChat from './pages/AIChat';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="properties" element={<Properties />} />
        <Route path="properties/:id" element={<PropertyDetail />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="properties/:id/book" element={<BookProperty />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="ai-chat" element={<AIChat />} />
        </Route>

        {/* Landlord routes */}
        <Route element={<ProtectedRoute allowedRoles={['landlord', 'admin']} />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="create-property" element={<CreateProperty />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
