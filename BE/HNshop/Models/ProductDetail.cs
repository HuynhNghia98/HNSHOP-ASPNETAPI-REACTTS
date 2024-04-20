using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HNshop.Models
{
	public class ProductDetail
	{
		[Key]
		[Required]
		public int Id { get; set; }
		[Required]
		public int Quantity { get; set; }
		public DateTime CreateTime { get; set; } = DateTime.Now;
		public DateTime UpdateTime { get; set; }

		[Required]
		public int SizeId { get; set; }
		[ForeignKey("SizeId")]
		//[ValidateNever]
		public Size Size { get; set; }


		[Required]
		public int ProductId { get; set; }
		[ForeignKey("ProductId")]
		//[ValidateNever]
		public Product Product { get; set; }

		//[ValidateNever]
		public ICollection<Item>? Items { get; set; }
	}
}
