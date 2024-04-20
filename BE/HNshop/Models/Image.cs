using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace HNshop.Models
{
	public class Image
	{
		[Key]
		[Required]
		public int Id { get; set; }
		[Required]
		public string ImageUrl { get; set; }

		[Required]
		public int ProductId { get; set; }
		[ForeignKey("ProductId")]
		public Product Product { get; set; }
	}
}
