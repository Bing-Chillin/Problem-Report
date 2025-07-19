
using Microsoft.EntityFrameworkCore;
using ProblemReport.Data;
using ProblemReport.Logic.Dto;

namespace ProblemReport.Endpoint;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("CorsPolicy",
                builder => builder.AllowAnyMethod()
                                  .AllowAnyHeader()
                                  .WithOrigins("http://localhost:5173", "https://127.0..00.1:5173"));
        });

        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        builder.Services.AddTransient(typeof(Repository<>));
        builder.Services.AddTransient<DtoProvider>();

        builder.Services.AddDbContext<ProblemReportContext>(opt =>
            {
                opt.UseSqlite("Data Source=ProblemReport.db");
            });

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();

        app.UseAuthorization();


        app.MapControllers();

        app.UseCors("CorsPolicy");

        app.Run();
    }
}
