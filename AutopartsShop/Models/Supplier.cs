namespace AutoPartsStore.Models
{
    public class Supplier
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Country { get; set; } = string.Empty;
        public string? Category { get; set; } = string.Empty;
        public string? ContractNumber { get; set; } = string.Empty;
    }
}