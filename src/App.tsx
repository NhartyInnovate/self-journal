import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { OrdersList } from './pages/admin/OrdersList';
import { OrderDetails } from './pages/admin/OrderDetails';
import { ProductSettings } from './pages/admin/ProductSettings';
import { EmailSettings } from './pages/admin/EmailSettings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<OrdersList />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="product" element={<ProductSettings />} />
          <Route path="emails" element={<EmailSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
