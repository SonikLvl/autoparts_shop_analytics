/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layout, ViewType } from './components/Layout';
import { Dashboard } from './views/Dashboard';
import { Suppliers } from './views/Suppliers';
import { ProductSupply } from './views/ProductSupply';
import { Customers } from './views/Customers';
import { Warehouse } from './views/Warehouse';
import { MonthlySales } from './views/MonthlySales';
import { SupplierShare } from './views/SupplierShare';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'suppliers': return <Suppliers />;
      case 'product-supply': return <ProductSupply />;
      case 'customers': return <Customers />;
      case 'warehouse': return <Warehouse />;
      case 'monthly-sales': return <MonthlySales />;
      case 'supplier-share': return <SupplierShare />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </Layout>
  );
}
