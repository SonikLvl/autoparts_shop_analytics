namespace AutoPartsStore.Models
{
    public class Warehouse
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int? Quantity { get; set; }
        public string CellNumber { get; set; } = string.Empty;
    }
}