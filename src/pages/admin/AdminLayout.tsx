import { useEffect, useState } from 'react';
import { Outlet, Navigate, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Settings, LogOut } from 'lucide-react';

export function AdminLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/auth/me');
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, [location.pathname]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen flex bg-[#FAFAF8] text-[#111111] font-sans">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white border-r border-[#EAEAEA] flex flex-col">
        <div className="p-6 pb-2">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded bg-[#111111] flex items-center justify-center">
              <span className="text-[#B5964A] font-serif font-bold text-lg leading-none">R</span>
            </div>
            <h2 className="text-xl font-serif font-semibold tracking-wide">Admin</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-8">
          <div>
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Menu</p>
            <nav className="space-y-1">
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
                    isActive ? 'bg-[#111111] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <LayoutDashboard className={`mr-3 h-5 w-5 ${location.pathname === '/admin' ? 'text-[#B5964A]' : 'text-gray-400'}`} />
                Dashboard
              </NavLink>
              <NavLink
                to="/admin/orders"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
                    isActive ? 'bg-[#111111] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <ShoppingCart className={`mr-3 h-5 w-5 ${location.pathname.startsWith('/admin/orders') ? 'text-[#B5964A]' : 'text-gray-400'}`} />
                Orders
              </NavLink>
            </nav>
          </div>

          <div>
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">General</p>
            <nav className="space-y-1">
              <NavLink
                to="/admin/product"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
                    isActive ? 'bg-[#111111] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <Settings className={`mr-3 h-5 w-5 ${location.pathname === '/admin/product' ? 'text-[#B5964A]' : 'text-gray-400'}`} />
                Product Settings
              </NavLink>
              <NavLink
                to="/admin/emails"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
                    isActive ? 'bg-[#111111] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <Settings className={`mr-3 h-5 w-5 ${location.pathname === '/admin/emails' ? 'text-[#B5964A]' : 'text-gray-400'}`} />
                Email Templates
              </NavLink>
            </nav>
          </div>
        </div>
        
        <div className="p-4 mt-auto border-t border-[#EAEAEA]">
          <button
            onClick={() => {
              document.cookie = 'admin_session=; Max-Age=0; path=/';
              navigate('/admin/login');
            }}
            className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-400" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-transparent z-10 px-8 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-serif text-[#111111]">Preorder Management System</h1>
          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full border border-[#EAEAEA] shadow-sm">
             <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                <span className="text-gray-500 font-medium">A</span>
             </div>
             <div className="text-sm">
               <p className="font-semibold text-gray-900 leading-none">Admin User</p>
             </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto px-8 pb-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
