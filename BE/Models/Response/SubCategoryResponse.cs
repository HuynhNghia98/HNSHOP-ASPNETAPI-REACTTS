using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HNshop.Models.Response
{
	public class SubCategoryResponse
	{
		public SubCategoryResponse()
		{
			SubCategories = new();
			Categories = new();
		}

		public List<SubCategory> SubCategories { get; set; }
		public List<Category> Categories { get; set; }
	}
}
