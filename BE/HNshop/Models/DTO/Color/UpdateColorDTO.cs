using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HNshop.Models.DTO.Color
{
	public class UpdateColorDTO
	{
		[Key]
		[Required]
		public int Id { get; set; }
		[Required(ErrorMessage = "Tên là bắt buộc.")]
		[MaxLength(50, ErrorMessage = "Tối đa 50 ký tự.")]
		public string Name { get; set; }
	}
}
