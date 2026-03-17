export interface Supplier {
  id: number;
  name: string;
  category: string;
  contactInfo: string;
}

export interface SupplyInfoDto {
  supplierName: string;
  price: number;
  deliveryTimeDays: number;
}

export interface CustomerStatDto {
  customerId: number;
  customerName: string;
  purchaseVolume: number;
  totalSpent: number;
}

export interface WarehouseItemDto {
  id: number;
  productName: string;
  volume: number;
  cellNumber: string;
}

export interface DashboardTopStatsDto {
  topProducts: { id: number; productName: string; salesVolume: number }[];
  cheapestSuppliers: { id: number; supplierName: string; averagePrice: number }[];
}

export interface MonthlySaleStatDto {
  productName: string;
  averageMonthlySales: number;
}

export interface SupplierShareDto {
  supplierName: string;
  sharePercentage: number;
  shareMoney: number;
  shareUnits: number;
  totalTurnover: number;
  totalProfit: number;
}
