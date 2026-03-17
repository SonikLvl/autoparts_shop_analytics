using AutoPartsStore.Models;
using AutoPartsStore.Models.DTOs;
using AutoPartsStore.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;

namespace AutoPartsStore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyticsController : ControllerBase
    {
        private readonly AnalyticsRepository _repository;
        private readonly IDistributedCache _cache;

        public AnalyticsController(AnalyticsRepository repository, IDistributedCache cache)
        {
            _repository = repository;
            _cache = cache;
        }

        // 1. GET: api/analytics/suppliers?category=Фірма&productName=Гальма&minVolume=100&startDate=2025-01-01&endDate=2025-12-31
        [HttpGet("suppliers")]
        public async Task<ActionResult<IEnumerable<SupplierResultDto>>> GetSuppliers( // Змінено Supplier на SupplierResultDto
            [FromQuery] string category = "",
            [FromQuery] string productName = "",
            [FromQuery] int minVolume = 0,
            [FromQuery] DateTime startDate = default,
            [FromQuery] DateTime endDate = default)
        {
            if (startDate == default) startDate = DateTime.MinValue;
            if (endDate == default) endDate = DateTime.MaxValue;

            var result = await _repository.GetSuppliersByCriteriaAsync(category, productName, minVolume, startDate, endDate);
            return Ok(result);
        }

        // 2. GET: api/analytics/product-supply-info?productName=Фільтр
        [HttpGet("product-supply-info")]
        public async Task<ActionResult<IEnumerable<SupplyInfoDto>>> GetProductSupplyInfo([FromQuery] string productName = "")
        {
            var result = await _repository.GetProductSupplyInfoAsync(productName);
            return Ok(result);
        }

        // 3. GET: api/analytics/customers?productName=Свічки&minVolume=50&startDate=2025-01-01&endDate=2025-12-31
        [HttpGet("customers")]
        public async Task<ActionResult<IEnumerable<CustomerStatDto>>> GetCustomers(
            [FromQuery] string productName = "",
            [FromQuery] int minVolume = 0,
            [FromQuery] DateTime startDate = default,
            [FromQuery] DateTime endDate = default)
        {
            if (startDate == default) startDate = DateTime.MinValue;
            if (endDate == default) endDate = DateTime.MaxValue;

            var result = await _repository.GetCustomersByProductAsync(productName, startDate, endDate, minVolume);
            return Ok(result);
        }

        // 4. GET: api/analytics/warehouse-inventory
        [HttpGet("warehouse-inventory")]
        public async Task<ActionResult<IEnumerable<WarehouseItemDto>>> GetWarehouseInventory()
        {
            var result = await _repository.GetWarehouseInventoryAsync();
            return Ok(result);
        }

        // 5. GET: api/analytics/top-stats
        [HttpGet("top-stats")]
        public async Task<ActionResult<DashboardTopStatsDto>> GetTopStats()
        {
            string cacheKey = "dashboard_top_stats";

            var cachedData = await _cache.GetStringAsync(cacheKey);

            if (!string.IsNullOrEmpty(cachedData))
            {
                var resultFromCache = JsonSerializer.Deserialize<DashboardTopStatsDto>(cachedData);
                return Ok(resultFromCache);
            }

            var result = await _repository.GetTopStatsAsync();

            var cacheOptions = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
            };

            string serializedData = JsonSerializer.Serialize(result);
            await _cache.SetStringAsync(cacheKey, serializedData, cacheOptions);

            return Ok(result);
        }

        // 6. GET: api/analytics/monthly-sales (З кешуванням Redis)
        [HttpGet("monthly-sales")]
        public async Task<ActionResult<IEnumerable<MonthlySaleStatDto>>> GetMonthlySales()
        {
            string cacheKey = "monthly_sales_stats";

            var cachedData = await _cache.GetStringAsync(cacheKey);

            if (!string.IsNullOrEmpty(cachedData))
            {
                var resultFromCache = JsonSerializer.Deserialize<IEnumerable<MonthlySaleStatDto>>(cachedData);
                return Ok(resultFromCache);
            }

            var result = await _repository.GetAverageMonthlySalesAsync();

            var cacheOptions = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
            };

            string serializedData = JsonSerializer.Serialize(result);
            await _cache.SetStringAsync(cacheKey, serializedData, cacheOptions);

            return Ok(result);
        }

        // 7. GET: api/analytics/supplier-share?supplierId=1&startDate=2025-01-01&endDate=2025-12-31
        [HttpGet("supplier-share")]
        public async Task<ActionResult<SupplierShareDto>> GetSupplierShare(
            [FromQuery] int supplierId,
            [FromQuery] DateTime startDate = default,
            [FromQuery] DateTime endDate = default)
        {
            if (startDate == default) startDate = DateTime.MinValue;
            if (endDate == default) endDate = DateTime.MaxValue;

            var result = await _repository.GetSupplierShareAsync(supplierId, startDate, endDate);
            return Ok(result);
        }
    }
}