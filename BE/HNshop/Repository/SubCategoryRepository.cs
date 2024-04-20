using Microsoft.EntityFrameworkCore;
using HNshop.DataAccess.Data;
using HNshop.DataAccess.Repository.IRepository;
using HNshop.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HNshop.DataAccess.Repository
{
	public class SubCategoryRepository : Repository<SubCategory>,ISubCategoryRepository
	{
		public SubCategoryRepository(ApplicationDbContext db) : base(db)
		{
		}

		public void Update(SubCategory SubCategory)
		{
			_db.Update(SubCategory);
		}
	}
}
