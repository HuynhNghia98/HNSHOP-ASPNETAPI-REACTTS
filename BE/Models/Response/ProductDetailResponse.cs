using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HNshop.Models.Response
{
	public class ProductDetailResponse
	{
		public ProductDetailResponse()
		{
			ProductDetails = new List<ProductDetail>();
			Products = new List<Product>();
			Sizes = new List<Size>();
		}

		public List<ProductDetail> ProductDetails { get; set; }
		public List<Size> Sizes { get; set; }
		public List<Product> Products { get; set; }
	}
}
