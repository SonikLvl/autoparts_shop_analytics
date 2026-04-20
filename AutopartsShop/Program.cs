using AutoPartsStore.Repositories;
using Npgsql;
using System.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("PostgresConnection");
builder.Services.AddTransient<IDbConnection>(sp => new NpgsqlConnection(connectionString));

builder.Services.AddScoped<AnalyticsRepository>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowVite", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://104.248.44.1:3000", "http://104.248.44.1:3001", "http://localhost:5174", "http://localhost:3000", "http://209.38.201.190")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var redisConnectionString = builder.Configuration.GetConnectionString("RedisConnection");

builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = redisConnectionString;
    options.InstanceName = "AutoPartsStore_"; 
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();
app.UseCors("AllowVite");

app.UseAuthorization();

app.MapControllers();

app.Run();
