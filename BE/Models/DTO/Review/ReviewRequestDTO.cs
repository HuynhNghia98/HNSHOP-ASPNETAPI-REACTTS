using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HNshop.Models.DTO.Review
{
	public class ReviewRequestDTO
	{
		public int Rating { get; set; } = 0;
		public string Title { get; set; }
		public string Description { get; set; }
		public string UserId { get; set; }
		public int ProductId { get; set; }
		public int ItemId { get; set; }
	}
}
