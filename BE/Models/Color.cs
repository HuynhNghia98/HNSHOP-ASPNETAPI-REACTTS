using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HNshop.Models
{
	public class Color
	{
		[Key]
		[Required]
		public int Id { get; set; }
		[Required]
		[MaxLength(50)]
		public string Name { get; set; }
		//[ValidateNever]
		public ICollection<Product>? Products { get; set; }
	}
}
