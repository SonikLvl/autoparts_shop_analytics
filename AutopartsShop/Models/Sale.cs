namespace AutoPartsStore.Models
{
    public class Sale
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string? CustomerName { get; set; } = string.Empty;
        public int? Quantity { get; set; }
        public decimal? SalePrice { get; set; }
        public DateTime? SaleDate { get; set; }
    }
}