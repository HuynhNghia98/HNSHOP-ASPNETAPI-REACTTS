using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HNshop.Models.Response
{
	public class CartResponse
	{
		public CartResponse() {
			Carts = new();
		}
		public List<ShoppingCart> Carts { get; set; }
		public double? SubTotal { get; set; } = 0;
		public double? SaleOffTotal { get; set; } = 0;
		public double? Total { get; set; } = 0;
	}
}
