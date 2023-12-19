using HNshop.DataAccess.Data;
using HNshop.DataAccess.Repository.IRepository;
using HNshop.Models;

namespace HNshop.DataAccess.Repository
{
	public class ShoppingCartRepository : Repository<ShoppingCart>, IShoppingCartRepository
	{
		public ShoppingCartRepository(ApplicationDbContext db) : base(db)
		{
		}
		
		public void Update(ShoppingCart shoppingCart)
		{
			_db.Update(shoppingCart);
		}
	}
}
