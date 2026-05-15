using BLL.DTO;
using BLL.functions;
using BLL.Interfaces;
using DAL.functions;
using DAL.interfaces;
using DAL.modals;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        o.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAutoMapper(typeof(mapper));
builder.Services.AddScoped(typeof(IgmachBll), typeof(GmachBLL));
builder.Services.AddScoped(typeof(IgmachDal), typeof(GmachDal));
builder.Services.AddScoped(typeof(IcustomerBll), typeof(CustomerBll));
builder.Services.AddScoped(typeof(IcustomerDal), typeof(CustomerDal));
builder.Services.AddScoped(typeof(IproductBll), typeof(ProductBll));
builder.Services.AddScoped(typeof(IproductDal), typeof(ProductDal));

//����� ���� �� ���� ������
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' is missing.");

builder.Services.AddDbContext<gmachContext>(o => o.UseSqlServer(connectionString));
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowAll");  
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
