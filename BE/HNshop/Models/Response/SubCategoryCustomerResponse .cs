using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HNshop.Models.Response
{
	public class SubCategoryCustomerResponse
	{
		public SubCategoryCustomerResponse() 
		{
			Products = new();
			ProductColors = new();
			SubCategory = new();
		}

		public List<Product> Products { get; set; }
		public List<Product> ProductColors { get; set; }
		public SubCategory SubCategory { get; set; }
		public int PageIndex { get; set; }
		public int TotalPages { get; set; }
		public int ProductsCount { get; set; }
		public bool HasPreviousPage { get; set; }
		public bool HasNextPage { get; set; }
	}
}
