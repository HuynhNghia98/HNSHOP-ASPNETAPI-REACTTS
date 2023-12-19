using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HNshop.Models.Response
{
	public class CategoryCustomerResponse
	{
		public List<SubCategory> SubCategories { get; set; } 
		public List<Product> Products { get; set; }
		public List<Product> ProductColors { get; set; }
		public Category Category { get; set; }
		public int PageIndex { get; set; }
		public int TotalPages { get; set; }
		public bool HasPreviousPage { get; set; }
		public bool HasNextPage { get; set; }
	}
}
