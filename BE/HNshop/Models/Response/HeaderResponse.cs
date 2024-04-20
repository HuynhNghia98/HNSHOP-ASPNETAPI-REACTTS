using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HNshop.Models.Response
{
	public class HeaderResponse
	{
		public HeaderResponse() 
		{
			Cloths = new();
			Accessories = new();
		}

		public List<SubCategory> Cloths { get; set; }
		public List<SubCategory> Accessories { get; set; }
	}
}
