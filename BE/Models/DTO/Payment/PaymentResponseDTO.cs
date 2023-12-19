using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HNshop.Models.DTO.Payment
{
    public class PaymentResponsetDTO
    {
		public PaymentResponsetDTO() 
		{
			ShoppingCarts = new();
		}

		public List<ShoppingCart> ShoppingCarts { get; set; }
		public string StripePaymentIntentId { get; set; } = "";
		public string ClientSecret { get; set; } = "";
		public double CartTotal { get; set; } = 0;
	}
}
