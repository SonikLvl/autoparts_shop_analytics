using System.Data;
using Dapper;
using AutoPartsStore.Models;
using AutoPartsStore.Models.DTOs;

namespace AutoPartsStore.Repositories
{
    public class AnalyticsRepository
    {
        private readonly IDbConnection _db;

        public AnalyticsRepository(IDbConnection dbConnection)
        {
            _db = dbConnection;
        }

        // 1. Отримати перелік постачальників певної категорії, що постачають товар або поставили його в певному обсязі
        public async Task<IEnumerable<SupplierResultDto>> GetSuppliersByCriteriaAsync(string category, string productName, int minVolume, DateTime startDate, DateTime endDate)
        {
            var sql = @"
                SELECT 
                    s.id AS Id, 
                    s.name AS Name, 
                    s.category AS Category, 
                    s.country || ' (Контракт: ' || s.contract_number || ')' AS ContactInfo
                FROM suppliers s
                JOIN supplier_offers so ON s.id = so.supplier_id
                JOIN products p ON so.product_id = p.id
                WHERE s.category LIKE '%' || :Category || '%' 
                  AND p.name LIKE '%' || :ProductName || '%'
                UNION
                SELECT 
                    s.id AS Id, 
                    s.name AS Name, 
                    s.category AS Category, 
                    s.country || ' (Контракт: ' || s.contract_number || ')' AS ContactInfo
                FROM suppliers s
                JOIN purchase_orders po ON s.id = po.supplier_id
                JOIN products p ON po.product_id = p.id
                WHERE s.category LIKE '%' || :Category || '%' 
                  AND p.name LIKE '%' || :ProductName || '%' 
                  AND po.quantity >= :MinVolume 
                  AND po.order_date BETWEEN :StartDate AND :EndDate";

            return await _db.QueryAsync<SupplierResultDto>(sql, new
            {
                Category = category,
                ProductName = productName,
                MinVolume = minVolume,
                StartDate = startDate,
                EndDate = endDate
            });
        }

        // 2. Отримати відомості про конкретний вид деталей (постачальники, розцінки, час поставки)
        public async Task<IEnumerable<SupplyInfoDto>> GetProductSupplyInfoAsync(string productName)
        {
            var sql = @"
                SELECT 
                    s.name AS SupplierName, 
                    so.unit_price AS Price, 
                    so.delivery_days AS DeliveryTimeDays
                FROM products p
                JOIN supplier_offers so ON p.id = so.product_id
                JOIN suppliers s ON so.supplier_id = s.id
                WHERE p.name LIKE '%' || :ProductName || '%'";

            return await _db.QueryAsync<SupplyInfoDto>(sql, new { ProductName = productName });
        }

        // 3. Отримати перелік покупців, що купили вид товару за період, або в обсязі не менше вказаного
        public async Task<IEnumerable<CustomerStatDto>> GetCustomersByProductAsync(string productName, DateTime startDate, DateTime endDate, int minVolume)
        {
            var sql = @"
                SELECT 
                    DENSE_RANK() OVER (ORDER BY s.customer_name) AS CustomerId, -- Генеруємо ID для React
                    s.customer_name AS CustomerName, 
                    SUM(s.quantity) AS PurchaseVolume, 
                    SUM(s.quantity * s.sale_price) AS TotalSpent
                FROM sales s
                JOIN products p ON s.product_id = p.id
                WHERE p.name LIKE '%' || :ProductName || '%' -- Додано LIKE для зручнішого пошуку
                  AND (s.sale_date BETWEEN :StartDate AND :EndDate OR s.quantity >= :MinVolume)
                GROUP BY s.customer_name";

            return await _db.QueryAsync<CustomerStatDto>(sql, new
            {
                ProductName = productName,
                StartDate = startDate,
                EndDate = endDate,
                MinVolume = minVolume
            });
        }

        // 4. Отримати перелік, обсяг і номер комірки для всіх деталей на складі
        public async Task<IEnumerable<WarehouseItemDto>> GetWarehouseInventoryAsync()
        {
            var sql = @"
                SELECT 
                    w.id AS Id, 
                    p.name AS ProductName, 
                    w.quantity AS Volume, 
                    w.cell_number AS CellNumber
                FROM warehouse w
                JOIN products p ON w.product_id = p.id";

            return await _db.QueryAsync<WarehouseItemDto>(sql);
        }

        // 5. Вивести 10 деталей, що найбільше продаються, і 10 найдешевших постачальників
        public async Task<DashboardTopStatsDto> GetTopStatsAsync()
        {
            var result = new DashboardTopStatsDto();

            // Запит для Топ-10 деталей
            var sqlTopProducts = @"
                SELECT 
                    p.id AS Id,
                    p.name AS ProductName, 
                    SUM(s.quantity) AS SalesVolume
                FROM sales s
                JOIN products p ON s.product_id = p.id
                GROUP BY p.id, p.name
                ORDER BY SUM(s.quantity) DESC
                FETCH FIRST 10 ROWS ONLY";

            // Запит для Топ-10 найдешевших постачальників
            var sqlCheapestSuppliers = @"
                SELECT 
                    s.id AS Id,
                    s.name AS SupplierName, 
                    AVG(so.unit_price) AS AveragePrice
                FROM suppliers s
                JOIN supplier_offers so ON s.id = so.supplier_id
                GROUP BY s.id, s.name
                ORDER BY AVG(so.unit_price) ASC
                FETCH FIRST 10 ROWS ONLY";

            result.TopProducts = await _db.QueryAsync<TopProductDto>(sqlTopProducts);
            result.CheapestSuppliers = await _db.QueryAsync<TopSupplierDto>(sqlCheapestSuppliers);

            return result;
        }

        // 6. Отримати середнє число продажів на місяць по кожному виду деталей
        public async Task<IEnumerable<MonthlySaleStatDto>> GetAverageMonthlySalesAsync()
        {
            var sql = @"
                SELECT 
                    p.name AS ProductName, 
                    NVL(SUM(s.quantity) / NULLIF(COUNT(DISTINCT EXTRACT(MONTH FROM s.sale_date) + EXTRACT(YEAR FROM s.sale_date) * 12), 0), 0) AS AverageMonthlySales
                FROM sales s
                JOIN products p ON s.product_id = p.id
                GROUP BY p.name";

            return await _db.QueryAsync<MonthlySaleStatDto>(sql);
        }

        // 7. Отримати частку товару конкретного постачальника від усього обороту
        public async Task<SupplierShareDto> GetSupplierShareAsync(int supplierId, DateTime startDate, DateTime endDate)
        {
            var result = new SupplierShareDto();

            // 1. Отримуємо ім'я постачальника
            result.SupplierName = await _db.QueryFirstOrDefaultAsync<string>(
                "SELECT name FROM suppliers WHERE id = :SupplierId",
                new { SupplierId = supplierId }) ?? "Невідомий";

            // 2. Рахуємо загальний оборот та прибуток магазину
            // Прибуток = Сума (продажі - собівартість). Собівартість беремо як середню ціну закупівлі товару.
            var totalSql = @"
                SELECT 
                    NVL(SUM(s.quantity * s.sale_price), 0) AS TotalTurnover,
                    NVL(SUM(s.quantity * s.sale_price) - SUM(s.quantity * so_avg.avg_price), 0) AS TotalProfit
                FROM sales s
                JOIN (
                    SELECT product_id, AVG(unit_price) AS avg_price 
                    FROM supplier_offers 
                    GROUP BY product_id
                ) so_avg ON s.product_id = so_avg.product_id
                WHERE s.sale_date BETWEEN :StartDate AND :EndDate";

            // Використовуємо наш DTO для мапінгу результатів
            var totals = await _db.QueryFirstOrDefaultAsync<SupplierShareDto>(totalSql, new { StartDate = startDate, EndDate = endDate });

            if (totals != null)
            {
                result.TotalTurnover = totals.TotalTurnover;
                result.TotalProfit = totals.TotalProfit;
            }

            // 3. Рахуємо показники конкретного постачальника
            var supplierSql = @"
                SELECT 
                    NVL(SUM(s.quantity), 0) AS ShareUnits, 
                    NVL(SUM(s.quantity * s.sale_price), 0) AS ShareMoney
                FROM sales s
                JOIN supplier_offers so ON s.product_id = so.product_id
                WHERE so.supplier_id = :SupplierId 
                  AND s.sale_date BETWEEN :StartDate AND :EndDate";

            var supStats = await _db.QueryFirstOrDefaultAsync<SupplierShareDto>(supplierSql, new { SupplierId = supplierId, StartDate = startDate, EndDate = endDate });

            if (supStats != null)
            {
                result.ShareUnits = supStats.ShareUnits;
                result.ShareMoney = supStats.ShareMoney;
            }

            // 4. Вираховуємо відсоток частки постачальника від загального обороту
            if (result.TotalTurnover > 0)
            {
                result.SharePercentage = Math.Round((result.ShareMoney / result.TotalTurnover) * 100, 2);
            }

            return result;
        }
    }
}