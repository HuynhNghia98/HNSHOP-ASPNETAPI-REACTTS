using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HNshop.Models.Response
{
	public class ProductDetailCustomerResponse
	{
		public ProductDetailCustomerResponse()
		{
			Product = new();
			ProductDetails = new();
			Products = new();
		}
		public Product Product { get; set; }
		public List<ProductDetail> ProductDetails { get; set; }
		public List<Product> Products { get; set; }
	}
}
