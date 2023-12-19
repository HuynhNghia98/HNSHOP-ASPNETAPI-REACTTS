using HNshop.Utility;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HNshop.Models.DTO.Product
{
	public class UpdateProductDTO
	{
		[Key]
		[Required]
		public int Id { get; set; }
		[Required(ErrorMessage = "Tên là bắt buộc.")]
		[MaxLength(100, ErrorMessage = "Tối đa 100 ký tự.")]
		public string Name { get; set; }
		[Required(ErrorMessage = "Giá là bắt buộc.")]
		public double Price { get; set; }
		public double Saleoff { get; set; }

		[MaxLength(500, ErrorMessage = "Tối đa 500 ký tự.")]
		public string? Description { get; set; }
		[Required(ErrorMessage = "Loại là bắt buộc.")]
		public int SubCategoryId { get; set; }
		[Required(ErrorMessage = "Màu là bắt buộc.")]
		public int ColorId { get; set; }

		public List<IFormFile>? Files { get; set; }
	}
}
