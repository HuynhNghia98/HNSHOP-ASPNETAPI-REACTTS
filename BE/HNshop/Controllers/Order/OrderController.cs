using HNshop.DataAccess.Repository.IRepository;
using HNshop.Models;
using HNshop.Models.DTO.Order;
using HNshop.Models.Response;
using HNshop.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;
using System.Net;

namespace HNshop.Controllers.Order
{
	[Route("api/[controller]")]
	[ApiController]
	[Authorize]
	public class OrderController : ControllerBase
	{
		private readonly IUnitOfWork _unitOfWork;
		public ApiResponse<object> _res;
		public OrderController(IUnitOfWork unitOfWork)
		{
			_unitOfWork = unitOfWork;
			_res = new ApiResponse<object>();
		}

		[HttpPost("AddOrder")]
		public async Task<IActionResult> AddOrder([FromForm] OrderRequestDTO orderRequest)
		{
			if (orderRequest.UserId == null)
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.BadRequest;
				return NotFound(_res);
			}

			HNshop.Models.Order order = new()
			{
				Total = orderRequest.Total,
				OrderStatus = SD.Order_WaitForConfirmation,
				PaymentDate = DateTime.Now,
				PaymentIntentId = orderRequest.PaymentIntentId,
				Name = orderRequest.Name,
				PhoneNumber = orderRequest.PhoneNumber,
				StreetAddress = orderRequest.StreetAddress,
				City = orderRequest.City,
				PostalCode = orderRequest.PostalCode,
				ApplicationUserId = orderRequest.UserId
			};

			if (orderRequest.Status == "succeeded")
			{
				order.PaymentStatus = SD.Payment_Paid;
			}
			else
			{
				order.PaymentStatus = SD.Payment_UnPaid;
			}

			_unitOfWork.Order.Add(order);
			_unitOfWork.Save();

			var carts = await _unitOfWork.ShoppingCart
				.Get(x => x.ApplicationUserId == orderRequest.UserId, true)
				.Include(x => x.ProductDetail.Product)
				.ToListAsync();

			foreach (var cart in carts)
			{
				//add item
				Item item = new()
				{
					Quantity = cart.Quantity,
					Price = cart.ProductDetail.Product.Price - (cart.ProductDetail.Product.Price * (cart.ProductDetail.Product.Saleoff / 100)),
					ProductDetailId = cart.ProductDetailId,
					OrderId = order.Id
				};
				_unitOfWork.Item.Add(item);
				//minus productDetail
				var productDetailsInOrder = _unitOfWork.ProductDetail.Get(x => x.Id == cart.ProductDetailId, true).FirstOrDefault();
				if (productDetailsInOrder != null)
				{
					productDetailsInOrder.Quantity -= cart.Quantity;
					_unitOfWork.ProductDetail.Update(productDetailsInOrder);
				}
			}

			var cartToRemove = await _unitOfWork.ShoppingCart
				.Get(x => x.ApplicationUserId == orderRequest.UserId, true)
				.ToListAsync();

			_unitOfWork.ShoppingCart.RemoveRange(cartToRemove);
			_unitOfWork.Save();


			_res.StatusCode = HttpStatusCode.OK;
			_res.Result = order.Id;
			return Ok(_res);
		}
	}
}
