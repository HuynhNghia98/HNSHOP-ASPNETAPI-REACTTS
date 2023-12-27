using HNshop.DataAccess.Repository.IRepository;
using HNshop.Models;
using HNshop.Models.Response;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace HNshop.Controllers.Customer
{
	[Route("api/Customer/[controller]")]
	[ApiController]
	public class LayoutCustomerController : ControllerBase
	{
		private readonly IUnitOfWork _unitOfWork;
		public ApiResponse<object> _res;

		public LayoutCustomerController(IUnitOfWork unitOfWork)
		{
			_unitOfWork = unitOfWork;
			_res = new();
		}

		[HttpGet("GetAll")]
		public async Task<IActionResult> GetAll()
		{
			HeaderResponse response = new HeaderResponse()
			{
				Cloths = await _unitOfWork.SubCategory.Get(x => x.Category.Name == "Cloths", true).ToListAsync(),
				Accessories = await _unitOfWork.SubCategory.Get(x => x.Category.Name == "Accessories", true).ToListAsync(),
			};
			_res.Result = response;
			_res.StatusCode = HttpStatusCode.OK;

			return Ok(_res);
		}

		[HttpGet("GetCart/{userId}")]
		public async Task<IActionResult> GetCart(string userId)
		{
			if (string.IsNullOrEmpty(userId))
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.BadRequest;
				return BadRequest(_res);
			}

			var cartCount = await _unitOfWork.ShoppingCart.Get(x => x.ApplicationUserId == userId, true).CountAsync();
			_res.Result = cartCount;
			_res.StatusCode = HttpStatusCode.OK;

			return Ok(_res);
		}

		[HttpPost("Search")]
		public async Task<IActionResult> Search([FromForm] string? search)
		{
			if (string.IsNullOrEmpty(search))
			{
				_res.Result = new List<Product>();
			}
			else
			{
				var productsSearched = await _unitOfWork.Product
				.Get(x => x.Name.Contains(search), true)
				.Include(x => x.Images)
				.Include(x => x.SubCategory)
				.ToListAsync();

				_res.Result = productsSearched;
			}
			_res.StatusCode = HttpStatusCode.OK;
			return Ok(_res);
		}
	}
}
