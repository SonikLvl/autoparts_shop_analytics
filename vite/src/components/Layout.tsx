import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  PackageSearch, 
  ShoppingCart, 
  Warehouse, 
  BarChart3, 
  PieChart,
  Menu,
  X
} from 'lucide-react';
import { clsx } from 'clsx';

export type ViewType = 'dashboard' | 'suppliers' | 'product-supply' | 'customers' | 'warehouse' | 'monthly-sales' | 'supplier-share';

interface LayoutProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  children: React.ReactNode;
}

const navItems = [
  { id: 'dashboard', label: 'Топ Статистика', icon: LayoutDashboard },
  { id: 'suppliers', label: 'Постачальники', icon: Users },
  { id: 'product-supply', label: 'Інфо про деталі', icon: PackageSearch },
  { id: 'customers', label: 'Покупці', icon: ShoppingCart },
  { id: 'warehouse', label: 'Склад', icon: Warehouse },
  { id: 'monthly-sales', label: 'Середні продажі', icon: BarChart3 },
  { id: 'supplier-share', label: 'Частка постачальника', icon: PieChart },
];

export function Layout({ currentView, onViewChange, children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        "fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-slate-300 transition-transform duration-300 lg:static lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-6 bg-slate-950">
          <span className="text-lg font-bold text-white tracking-tight">AutoParts Analytics</span>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id as ViewType);
                  setSidebarOpen(false);
                }}
                className={clsx(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-indigo-500/10 text-indigo-400" 
                    : "hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 lg:px-8 shrink-0">
          <button 
            className="lg:hidden mr-4 text-slate-500 hover:text-slate-900"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold text-slate-800">
            {navItems.find(i => i.id === currentView)?.label}
          </h1>
        </header>
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
