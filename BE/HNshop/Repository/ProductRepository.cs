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
	public class ProductRepository : Repository<Product>, IProductRepository
	{
		public ProductRepository(ApplicationDbContext db) : base(db)
		{
		}
		public void Update(Product product)
		{
			_db.Update(product);
		}
	}
}
