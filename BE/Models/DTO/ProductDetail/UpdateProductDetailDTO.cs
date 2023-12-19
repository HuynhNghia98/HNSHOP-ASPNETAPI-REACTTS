using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HNshop.Models.DTO.ProductDetail
{
	public class UpdateProductDetailDTO
	{
		[Key]
		[Required]
		public int Id { get; set; }
		[Required(ErrorMessage = "Số lượng là bắt buộc.")]
		public int Quantity { get; set; }

		[Required(ErrorMessage = "Kích cỡ là bắt buộc.")]
		public int SizeId { get; set; }

		[Required(ErrorMessage = "Sản phẩm là bắt buộc.")]
		public int ProductId { get; set; }
	}
}
