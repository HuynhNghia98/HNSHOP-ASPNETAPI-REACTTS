using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HNshop.Models.Response
{
	public class ProductResponse
	{
		public ProductResponse()	
		{
			Products = new List<Product>();
			SubCategories = new List<SubCategory>();
			Colors = new List<Color>();
		}
		public List<Product> Products { get; set; }
		public List<SubCategory> SubCategories { get; set; }
		public List<Color> Colors { get; set; }
	}
}
