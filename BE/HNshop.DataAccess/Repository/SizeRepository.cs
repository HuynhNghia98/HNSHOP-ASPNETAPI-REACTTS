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
	public class SizeRepository : Repository<Size>, ISizeRepository
	{
		public SizeRepository(ApplicationDbContext db) : base(db)
		{
		}

		public void Update(Size size)
		{
			_db.Update(size);
		}
	}
}
