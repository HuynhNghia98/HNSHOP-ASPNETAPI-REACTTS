using Microsoft.EntityFrameworkCore;
using HNshop.DataAccess.Data;
using HNshop.DataAccess.Repository.IRepository;
using HNshop.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace HNshop.DataAccess.Repository
{
	public class CategoryRepository : Repository<Category>, ICategoryRepository
	{
		public CategoryRepository(ApplicationDbContext db) : base(db)
		{
		}
		
		public void Update(Category category)
		{
			_db.Update(category);
		}
	}
}
