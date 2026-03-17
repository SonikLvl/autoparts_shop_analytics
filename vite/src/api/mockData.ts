import {
  Supplier,
  SupplyInfoDto,
  CustomerStatDto,
  WarehouseItemDto,
  DashboardTopStatsDto,
  MonthlySaleStatDto,
  SupplierShareDto,
} from '../types/api';

export const mockSuppliers: Supplier[] = [
  { id: 1, name: 'AutoParts Co', category: 'Фірма', contactInfo: 'contact@autoparts.com' },
  { id: 2, name: 'BrakeMasters', category: 'Фірма', contactInfo: 'sales@brakemasters.com' },
  { id: 3, name: 'FilterKing', category: 'Дилер', contactInfo: 'info@filterking.com' },
  { id: 4, name: 'GlobalSpares', category: 'Фірма', contactInfo: 'global@spares.com' },
  { id: 5, name: 'LocalParts', category: 'Дилер', contactInfo: 'local@parts.ua' },
];

export const mockSupplyInfo: SupplyInfoDto[] = [
  { supplierName: 'AutoParts Co', price: 120.5, deliveryTimeDays: 2 },
  { supplierName: 'BrakeMasters', price: 115.0, deliveryTimeDays: 3 },
  { supplierName: 'FilterKing', price: 130.0, deliveryTimeDays: 1 },
];

export const mockCustomers: CustomerStatDto[] = [
  { customerId: 1, customerName: 'Іван Іванов', purchaseVolume: 150, totalSpent: 15000 },
  { customerId: 2, customerName: 'ТОВ ТрансАвто', purchaseVolume: 500, totalSpent: 45000 },
  { customerId: 3, customerName: 'Петро Петренко', purchaseVolume: 60, totalSpent: 6000 },
  { customerId: 4, customerName: 'СТО "Мотор"', purchaseVolume: 1200, totalSpent: 115000 },
];

export const mockWarehouse: WarehouseItemDto[] = [
  { id: 1, productName: 'Гальмівні колодки', volume: 300, cellNumber: 'A-12' },
  { id: 2, productName: 'Масляний фільтр', volume: 1500, cellNumber: 'B-05' },
  { id: 3, productName: 'Свічки запалювання', volume: 800, cellNumber: 'C-01' },
  { id: 4, productName: 'Амортизатор', volume: 120, cellNumber: 'D-10' },
  { id: 5, productName: 'Ремінь ГРМ', volume: 45, cellNumber: 'A-02' },
];

export const mockTopStats: DashboardTopStatsDto = {
  topProducts: [
    { id: 1, productName: 'Масляний фільтр', salesVolume: 5000 },
    { id: 2, productName: 'Гальмівні колодки', salesVolume: 3200 },
    { id: 3, productName: 'Свічки запалювання', salesVolume: 2800 },
    { id: 4, productName: 'Повітряний фільтр', salesVolume: 2100 },
    { id: 5, productName: 'Амортизатор', salesVolume: 1500 },
    { id: 6, productName: 'Ремінь ГРМ', salesVolume: 1200 },
    { id: 7, productName: 'Лампи H7', salesVolume: 950 },
    { id: 8, productName: 'Антифриз', salesVolume: 800 },
    { id: 9, productName: 'Двірники', salesVolume: 750 },
    { id: 10, productName: 'Акумулятор', salesVolume: 400 },
  ],
  cheapestSuppliers: [
    { id: 1, supplierName: 'FilterKing', averagePrice: 45.5 },
    { id: 2, supplierName: 'AutoParts Co', averagePrice: 55.0 },
    { id: 3, supplierName: 'BrakeMasters', averagePrice: 60.0 },
    { id: 4, supplierName: 'LocalParts', averagePrice: 62.5 },
    { id: 5, supplierName: 'GlobalSpares', averagePrice: 65.0 },
    { id: 6, supplierName: 'UkrParts', averagePrice: 68.0 },
    { id: 7, supplierName: 'EuroAuto', averagePrice: 70.5 },
    { id: 8, supplierName: 'JapanSpares', averagePrice: 75.0 },
    { id: 9, supplierName: 'KoreaParts', averagePrice: 78.0 },
    { id: 10, supplierName: 'PremiumAuto', averagePrice: 85.0 },
  ],
};

export const mockMonthlySales: MonthlySaleStatDto[] = [
  { productName: 'Масляний фільтр', averageMonthlySales: 416 },
  { productName: 'Гальмівні колодки', averageMonthlySales: 266 },
  { productName: 'Свічки запалювання', averageMonthlySales: 233 },
  { productName: 'Повітряний фільтр', averageMonthlySales: 175 },
  { productName: 'Амортизатор', averageMonthlySales: 125 },
];

export const mockSupplierShare: SupplierShareDto = {
  supplierName: 'AutoParts Co',
  sharePercentage: 35.5,
  shareMoney: 150000,
  shareUnits: 2500,
  totalTurnover: 422535,
  totalProfit: 84500,
};
