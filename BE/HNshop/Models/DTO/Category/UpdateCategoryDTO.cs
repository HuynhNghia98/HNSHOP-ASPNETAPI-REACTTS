using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HNshop.Models.DTO.Category
{
	public class UpdateSubCategoryDTO
	{
		[Key]
		[Required]
		public int Id { get; set; }

		[Required(ErrorMessage = "Tên là bắt buộc.")]
		[MaxLength(100)]
		public string Name { get; set; }
		[Required(ErrorMessage = "UrlName là bắt buộc.")]
		public string UrlName { get; set; }

		[MaxLength(500, ErrorMessage = "Tối đa 500 ký tự.")]
		public string? Description { get; set; }
	}
}
