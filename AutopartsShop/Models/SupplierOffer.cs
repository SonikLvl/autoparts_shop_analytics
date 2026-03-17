namespace AutoPartsStore.Models
{
    public class SupplierOffer
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int SupplierId { get; set; }
        public decimal? UnitPrice { get; set; }
        public int? DeliveryDays { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}