using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using HNshop.Data.DbInitializer;
using HNshop.Models;
using HNshop.DataAccess.Data;
using HNshop.DataAccess.Repository.IRepository;
using HNshop.Utility;

namespace HNshop.DataAccess.DbInitializer
{
	public class DbInitializer : IDbInitializer
	{
		private readonly ApplicationDbContext _db;
		private readonly IUnitOfWork _unitOfWork;
		private readonly UserManager<ApplicationUser> _userManager;
		private readonly RoleManager<IdentityRole> _roleManager;

		public DbInitializer(ApplicationDbContext db, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IUnitOfWork unitOfWork)
		{
			_db = db;
			_userManager = userManager;
			_roleManager = roleManager;
			_unitOfWork = unitOfWork;
		}

		public void Initializer()
		{
			try
			{
				if (_db.Database.GetPendingMigrations().Count() > 0)
				{
					_db.Database.Migrate();
				}
			}
			catch (Exception ex) { }

			//Tạo Role nếu không có
			if (!_roleManager.RoleExistsAsync(SD.Role_Admin).GetAwaiter().GetResult())
			{
				_roleManager.CreateAsync(new IdentityRole(SD.Role_Admin)).GetAwaiter().GetResult();
				_roleManager.CreateAsync(new IdentityRole(SD.Role_Customer)).GetAwaiter().GetResult();

				//Tạo tài khoản admin
				var newUser = new ApplicationUser
				{
					UserName = "admin",
					Email = "admin@gmail.com",
					Name = "Nghia",
					PhoneNumber = "0123456789",
				};

				_userManager.CreateAsync(newUser, "123").GetAwaiter().GetResult();

				var user = _db.ApplicationUsers.FirstOrDefault(x => x.Id == newUser.Id);
				_userManager.AddToRoleAsync(user, SD.Role_Admin).GetAwaiter().GetResult();

				//Tạo Category
				List<Category> newCategories = new()
				{
					new Category { Name = "Cloths", UrlName = "cloths" },
					new Category { Name = "Shoes", UrlName = "shoes" },
					new Category { Name = "Accessories", UrlName = "Accessories" }
				};

                foreach (var item in newCategories)
                {
					_unitOfWork.Category.Add(item);
				}
				_unitOfWork.Save();
			}
			return;
		}
	}
}
