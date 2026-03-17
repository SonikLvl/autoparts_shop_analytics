import * as mockData from './mockData';
import {
  Supplier,
  SupplyInfoDto,
  CustomerStatDto,
  WarehouseItemDto,
  DashboardTopStatsDto,
  MonthlySaleStatDto,
  SupplierShareDto,
} from '../types/api';

const USE_MOCK = false; // Toggle this to switch to real API
const API_BASE_URL = 'https://localhost:7180/api/analytics';

export const apiClient = {
  async getSuppliers(category?: string, productName?: string, minVolume?: number, startDate?: string, endDate?: string): Promise<Supplier[]> {
    if (USE_MOCK) return new Promise(resolve => setTimeout(() => resolve(mockData.mockSuppliers), 500));
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (productName) params.append('productName', productName);
    if (minVolume) params.append('minVolume', minVolume.toString());
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const res = await fetch(`${API_BASE_URL}/suppliers?${params.toString()}`);
    return res.json();
  },

  async getProductSupplyInfo(productName?: string): Promise<SupplyInfoDto[]> {
    if (USE_MOCK) return new Promise(resolve => setTimeout(() => resolve(mockData.mockSupplyInfo), 500));
    const params = new URLSearchParams();
    if (productName) params.append('productName', productName);
    const res = await fetch(`${API_BASE_URL}/product-supply-info?${params.toString()}`);
    return res.json();
  },

  async getCustomers(productName?: string, minVolume?: number, startDate?: string, endDate?: string): Promise<CustomerStatDto[]> {
    if (USE_MOCK) return new Promise(resolve => setTimeout(() => resolve(mockData.mockCustomers), 500));
    const params = new URLSearchParams();
    if (productName) params.append('productName', productName);
    if (minVolume) params.append('minVolume', minVolume.toString());
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const res = await fetch(`${API_BASE_URL}/customers?${params.toString()}`);
    return res.json();
  },

  async getWarehouseInventory(): Promise<WarehouseItemDto[]> {
    if (USE_MOCK) return new Promise(resolve => setTimeout(() => resolve(mockData.mockWarehouse), 500));
    const res = await fetch(`${API_BASE_URL}/warehouse-inventory`);
    return res.json();
  },

  async getTopStats(): Promise<DashboardTopStatsDto> {
    if (USE_MOCK) return new Promise(resolve => setTimeout(() => resolve(mockData.mockTopStats), 500));
    const res = await fetch(`${API_BASE_URL}/top-stats`);
    return res.json();
  },

  async getMonthlySales(): Promise<MonthlySaleStatDto[]> {
    if (USE_MOCK) return new Promise(resolve => setTimeout(() => resolve(mockData.mockMonthlySales), 500));
    const res = await fetch(`${API_BASE_URL}/monthly-sales`);
    return res.json();
  },

  async getSupplierShare(supplierId: number, startDate?: string, endDate?: string): Promise<SupplierShareDto> {
    if (USE_MOCK) return new Promise(resolve => setTimeout(() => resolve(mockData.mockSupplierShare), 500));
    const params = new URLSearchParams();
    params.append('supplierId', supplierId.toString());
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const res = await fetch(`${API_BASE_URL}/supplier-share?${params.toString()}`);
    return res.json();
  }
};
