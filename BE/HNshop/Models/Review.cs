using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HNshop.Models
{
	public class Review
	{
		[Key]
		[Required]
		public int Id { get; set; }
		[Required]
		public int Rating { get; set; }
		[Required]
		[MaxLength(200)]
		public string Title { get; set; }
		[Required]
		[MaxLength(500)]
		public string Description { get; set; }
		public DateTime CreateTime { get; set; } = DateTime.Now;

		[Required]
		public string ApplicationUserId { get; set; }
		[ForeignKey("ApplicationUserId")]
		public ApplicationUser ApplicationUser { get; set; }

		[Required]
		public int ProductId { get; set; }
		[ForeignKey("ProductId")]
		public Product Product { get; set; }

		[NotMapped]
		public string UserName { get; set;}
	}
}
