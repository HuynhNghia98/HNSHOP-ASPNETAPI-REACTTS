using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HNshop.Models
{
	public class ShoppingCart
	{
		[Key]
		[Required]
		public int Id { get; set; }

		[Required]
		[Range(1,100)]
		public int Quantity { get; set; }
		public DateTime CreateTime { get; set; } = DateTime.Now;

		[Required]
		public int ProductDetailId { get; set; }
		[ForeignKey("ProductDetailId")]
		public ProductDetail ProductDetail { get; set; }

		[Required]
		public string? ApplicationUserId { get; set; }
		[ForeignKey("ApplicationUserId")]
		//[ValidateNever]
		public ApplicationUser ApplicationUser { get; set; }

		public ICollection<Item>? Items { get; set; }

		[NotMapped]
		public double FinalPrice { get; set; } = 0;
		[NotMapped]
		public double FinalSubTotal { get; set; } = 0;
	}
}
