using HNshop.DataAccess.Data;
using HNshop.DataAccess.Repository.IRepository;
using HNshop.DataAccess.Repository;
using Microsoft.EntityFrameworkCore;
using HNshop.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using System.Text.Json.Serialization;

namespace HNshop
{
	public class Program
	{
		public static void Main(string[] args)
		{
			var builder = WebApplication.CreateBuilder(args);

			// Add services to the container.

			builder.Services.AddControllers();
			builder.Services.AddControllers().AddJsonOptions(options =>
			{
				options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
			});
			builder.Services.AddEndpointsApiExplorer();
			//config swagger jwt token
			builder.Services.AddSwaggerGen(o =>
			{
				o.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, new OpenApiSecurityScheme
				{
					Description = "JWT Authorization header using Bearer scheme. \r\n\r\n" +
								  "Enter 'Bearer' [space] and then your token in the text input below. \r\n\r\n" +
								  "Example: \"Bearer 123456abcdef\"",
					Name = "Authorization",
					In = ParameterLocation.Header,
					Scheme = JwtBearerDefaults.AuthenticationScheme,
				});
				o.AddSecurityRequirement(new OpenApiSecurityRequirement()
				{
					{
						new OpenApiSecurityScheme
						{
							Reference=new OpenApiReference
							{
								Type=ReferenceType.SecurityScheme,
								Id="Bearer"
							},
							Scheme="oauth2",
							Name="Bearer",
							In=ParameterLocation.Header,
						},
						new List<string>()
					}
				});
			});

			//dbcontext
			builder.Services.AddDbContext<ApplicationDbContext>
				(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
			//identity dbcontext
			builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
			.AddEntityFrameworkStores<ApplicationDbContext>();

			//config password
			builder.Services.Configure<IdentityOptions>(ops =>
			{
				ops.Password.RequireDigit = false;
				ops.Password.RequiredLength = 1;
				ops.Password.RequireUppercase = false;
				ops.Password.RequireLowercase = false;
				ops.Password.RequireNonAlphanumeric = false;
			});

			//config authentication
			var key = builder.Configuration.GetValue<string>("ApiSettings:SecretKey");
			builder.Services.AddAuthentication(x =>
			{
				x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
				x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
			}).AddJwtBearer(x =>
			{
				x.RequireHttpsMetadata = false;
				x.SaveToken = true;
				x.TokenValidationParameters = new TokenValidationParameters
				{
					ValidateIssuerSigningKey = true,
					IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key)),
					ValidateIssuer = false,
					ValidateAudience = false,
				};
			});

			//builder.Services.AddCors();
			builder.Services.AddCors();
			builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
			var app = builder.Build();

			// Configure the HTTP request pipeline.
			if (app.Environment.IsDevelopment())
			{
				app.UseSwagger();
				app.UseSwaggerUI();
			}

			app.UseHttpsRedirection();

			//can thiet de hien thi anh phia FE
			app.UseStaticFiles();
			app.UseCors(o => o.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
			app.UseAuthentication();
			app.UseAuthorization();

			app.MapControllers();

			app.Run();
		}
	}
}