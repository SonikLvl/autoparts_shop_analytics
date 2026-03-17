namespace AutoPartsStore.Models.DTOs
{
    public class SupplyInfoDto
    {
        public string SupplierName { get; set; } = string.Empty;
        public decimal Price { get; set; } 
        public int DeliveryTimeDays { get; set; } 
    }

    public class CustomerStatDto
    {
        public int CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public int PurchaseVolume { get; set; } 
        public decimal TotalSpent { get; set; } 
    }

    public class WarehouseItemDto
    {
        public int Id { get; set; } 
        public string ProductName { get; set; } = string.Empty;
        public int Volume { get; set; }
        public string CellNumber { get; set; } = string.Empty;
    }

    public class TopProductDto
    {
        public int Id { get; set; } 
        public string ProductName { get; set; } = string.Empty;
        public int SalesVolume { get; set; } 
    }

    public class TopSupplierDto
    {
        public int Id { get; set; } 
        public string SupplierName { get; set; } = string.Empty;
        public decimal AveragePrice { get; set; }
    }

    public class DashboardTopStatsDto
    {
        public IEnumerable<TopProductDto> TopProducts { get; set; } = new List<TopProductDto>();
        public IEnumerable<TopSupplierDto> CheapestSuppliers { get; set; } = new List<TopSupplierDto>();
    }

    public class MonthlySaleStatDto
    {
        public string ProductName { get; set; } = string.Empty;
        public decimal AverageMonthlySales { get; set; }
    }

    public class SupplierShareDto
    {
        public string SupplierName { get; set; } = string.Empty;
        public decimal SharePercentage { get; set; }
        public decimal ShareMoney { get; set; }
        public int ShareUnits { get; set; }
        public decimal TotalTurnover { get; set; }
        public decimal TotalProfit { get; set; }
    }


    public class SupplierResultDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string ContactInfo { get; set; } = string.Empty;
    }
}