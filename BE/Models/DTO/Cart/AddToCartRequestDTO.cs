using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HNshop.Models.DTO.Cart
{
    public class AddToCartRequestDTO
    {
        public string UserId { get; set; }
        public int ProductDetailId { get; set; }
        public int Quantity { get; set; }
    }
}
