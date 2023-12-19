using HNshop.DataAccess.Data;
using HNshop.DataAccess.Repository.IRepository;
using HNshop.Models.DTO.Payment;
using HNshop.Models.Response;
using HNshop.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;
using System.Net;

namespace HNshop.Controllers.Payment
{
	[Route("api/[controller]")]
	[ApiController]
	[Authorize]
	public class PaymentController : ControllerBase
	{
		private readonly IUnitOfWork _unitOfWork;
		private readonly IConfiguration _configuration;
		public ApiResponse<object> _res;
		public PaymentController(IUnitOfWork unitOfWork, IConfiguration configuration)
		{
			_unitOfWork = unitOfWork;
			_configuration = configuration;
			_res = new();
		}


		[HttpPost]
		public async Task<IActionResult> Payment([FromForm] string userId)
		{
			if (userId == null)
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.NotFound;
				return NotFound(_res);
			}

			var carts = await _unitOfWork.ShoppingCart.Get(x => x.ApplicationUserId == userId, true).Include(x => x.ProductDetail.Product).Include(x => x.ProductDetail.Size).ToListAsync();

			foreach (var item in carts)
			{
				if (item.ProductDetail.Product.Saleoff > 0)
				{
					item.FinalPrice = item.ProductDetail.Product.Price - (item.ProductDetail.Product.Price * (item.ProductDetail.Product.Saleoff / 100));
					item.FinalSubTotal = item.Quantity * item.FinalPrice;
				}
			}

			StripeConfiguration.ApiKey = _configuration["Stripe:Secretkey"];
			double cartTotal = carts.Sum(x => x.Quantity * (x.ProductDetail.Product.Price - (x.ProductDetail.Product.Price * (x.ProductDetail.Product.Saleoff / 100))));

			PaymentIntentCreateOptions options = new()
			{
				Amount = (int)cartTotal * 100,
				Currency = "usd",
				PaymentMethodTypes = new List<string>
				{
					"card",
				},
			};
			PaymentIntentService service = new();
			PaymentIntent response = service.Create(options);

			PaymentResponsetDTO paymentResponsetDTO = new()
			{
				ShoppingCarts = carts,
				StripePaymentIntentId = response.Id,
				ClientSecret = response.ClientSecret,
				CartTotal = cartTotal,
			};
			_res.IsSuccess = true;
			_res.StatusCode = HttpStatusCode.OK;
			_res.Result = paymentResponsetDTO;
			return Ok(_res);
		}
	}
}
