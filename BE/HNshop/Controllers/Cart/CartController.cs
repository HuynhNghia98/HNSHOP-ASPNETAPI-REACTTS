using HNshop.DataAccess.Repository.IRepository;
using HNshop.Models.Response;
using HNshop.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HNshop.Utility;
using System.Net;
using HNshop.DataAccess.Repository;
using Microsoft.EntityFrameworkCore;
using HNshop.Models.DTO.Auth;
using HNshop.Models.DTO.Cart;
using HNshop.DataAccess.Data;

namespace HNshop.Controllers.Cart
{
	[Route("api/[controller]")]
	[ApiController]
	[Authorize]

	public class CartController : ControllerBase
	{
		private readonly IUnitOfWork _unitOfWork;
		private readonly ApplicationDbContext _db;
		public ApiResponse<object> _res;
		public CartController(IUnitOfWork unitOfWork, ApplicationDbContext db)
		{
			_unitOfWork = unitOfWork;
			_db = db;
			_res = new();
		}

		[HttpGet("GetAll/{userId}")]
		public async Task<IActionResult> GetAll(string userId)
		{
			if (userId == null)
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.BadRequest;
				return BadRequest(_res);
			}
			_res.Result = await LoadAsync(userId);
			_res.StatusCode = HttpStatusCode.OK;
			return Ok(_res);
		}

		[HttpPost("AddToCart")]
		public async Task<IActionResult> AddToCart([FromForm] AddToCartRequestDTO addToCartRequest)
		{
			if (string.IsNullOrEmpty(addToCartRequest.UserId))
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.BadRequest;
				return BadRequest(_res);
			}
			if (addToCartRequest.ProductDetailId == 0)
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.BadRequest;
				ModelState.AddModelError(nameof(AddToCartRequestDTO.ProductDetailId), "You must choose 1 size.");
				_res.Errors = ModelState.ToDictionary(
							 kvp => kvp.Key,
							 kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
						 );
				return BadRequest(_res);
			}
			if (addToCartRequest.Quantity <= 0)
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.BadRequest;
				ModelState.AddModelError(nameof(AddToCartRequestDTO.ProductDetailId), "Quantity > 0.");
				_res.Errors = ModelState.ToDictionary(
							 kvp => kvp.Key,
							 kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
						 );
				return BadRequest(_res);
			}

			var productDetailInDb = await _unitOfWork.ProductDetail.Get(x => x.Id == addToCartRequest.ProductDetailId, true)
				.FirstOrDefaultAsync();

			if (productDetailInDb == null)
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.BadRequest;
				return BadRequest(_res);
			}

			var cartInDb = await _unitOfWork.ShoppingCart.Get(x => x.ProductDetailId == addToCartRequest.ProductDetailId && x.ApplicationUserId == addToCartRequest.UserId, true)
				.FirstOrDefaultAsync();

			if (cartInDb != null)
			{
				// shopping cart already exists
				cartInDb.Quantity += addToCartRequest.Quantity;
				if (productDetailInDb.Quantity < cartInDb.Quantity)
				{
					_res.IsSuccess = false;
					_res.StatusCode = HttpStatusCode.BadRequest;
					ModelState.AddModelError(nameof(AddToCartRequestDTO.Quantity), "quantity is not enough.");
					_res.Errors = ModelState.ToDictionary(
								 kvp => kvp.Key,
								 kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
							 );
					return BadRequest(_res);
				}
				_unitOfWork.ShoppingCart.Update(cartInDb);
			}
			else
			{
				//shopping cart does not exist
				ShoppingCart cart = new()
				{
					Quantity = addToCartRequest.Quantity,
					ProductDetailId = addToCartRequest.ProductDetailId,
					ApplicationUserId = addToCartRequest.UserId,
				};
				_unitOfWork.ShoppingCart.Add(cart);
			}
			_unitOfWork.Save();

			var cartCount = await _unitOfWork.ShoppingCart.GetAll().CountAsync();
			_res.Result = cartCount;
			_res.StatusCode = HttpStatusCode.OK;
			return Ok(_res);
		}

		[HttpPost("Add/{id}")]
		public async Task<IActionResult> Add(int id, [FromForm] string userId)
		{
			if (id == 0)
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.BadRequest;
				return BadRequest(_res);
			}

			var cart = await _unitOfWork.ShoppingCart.Get(x => x.Id == id, true).FirstOrDefaultAsync();

			if (cart == null)
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.NotFound;
				return NotFound(_res);
			}

			cart.Quantity++;

			_unitOfWork.ShoppingCart.Update(cart);
			_unitOfWork.Save();

			_res.Result = await LoadAsync(userId);
			_res.StatusCode = HttpStatusCode.OK;
			return Ok(_res);
		}

		[HttpPost("Minus/{id}")]
		public async Task<IActionResult> Minus(int id, [FromForm] string userId)
		{
			if (id == 0)
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.BadRequest;
				return BadRequest(_res);
			}

			var cart = await _unitOfWork.ShoppingCart.Get(x => x.Id == id, true).FirstOrDefaultAsync();

			if (cart == null)
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.NotFound;
				return NotFound(_res);
			}

			if (cart.Quantity > 1)
			{
				cart.Quantity--;
				_unitOfWork.ShoppingCart.Update(cart);
			}
			else
			{
				_unitOfWork.ShoppingCart.Remove(cart);
			}
			_unitOfWork.Save();

			_res.Result = await LoadAsync(userId);
			_res.StatusCode = HttpStatusCode.OK;
			return Ok(_res);
		}

		[HttpPost("Delete/{id}")]
		public async Task<IActionResult> Delete(int id, [FromForm] string userId)
		{
			if (id == 0)
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.BadRequest;
				return BadRequest(_res);
			}

			var cart = await _unitOfWork.ShoppingCart.Get(x => x.Id == id, true).FirstOrDefaultAsync();

			if (cart == null)
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.NotFound;
				return NotFound(_res);
			}
			_unitOfWork.ShoppingCart.Remove(cart);
			_unitOfWork.Save();

			_res.Result = await LoadAsync(userId);
			_res.StatusCode = HttpStatusCode.OK;
			return Ok(_res);
		}

		[HttpGet("GetDeliveryInformation/{userId}")]
		public async Task<IActionResult> GetDeliveryInformation(string userId)
		{
			if (userId == null)
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.NotFound;
				return NotFound(_res);
			}

			var userInDb = await _db.Users.FirstOrDefaultAsync(x => x.Id == userId);

			if (userInDb == null)
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.NotFound;
				return NotFound(_res);
			}

			_res.StatusCode = HttpStatusCode.OK;
			_res.Result = userInDb;
			return Ok(_res);
		}


		private async Task<CartResponse> LoadAsync(string userId)
		{
			var carts = await _unitOfWork.ShoppingCart.Get(x => x.ApplicationUserId == userId, true).Include(x => x.ProductDetail.Product.Images)
				.Include(x => x.ProductDetail.Size)
				.Include(x => x.ProductDetail.Product.SubCategory)
				.ToListAsync();

			foreach (var item in carts)
			{
				if (item.ProductDetail.Product.Saleoff > 0)
				{
					item.FinalPrice = item.ProductDetail.Product.Price - (item.ProductDetail.Product.Price * (item.ProductDetail.Product.Saleoff / 100));
					item.FinalSubTotal = item.Quantity * item.FinalPrice;
				}
			}

			var subTotal = await _unitOfWork.ShoppingCart.Get(x => x.ApplicationUserId == userId, true)
				.SumAsync(x => x.Quantity * x.ProductDetail.Product.Price);
			var saleoffTotal = await _unitOfWork.ShoppingCart.Get(x => x.ApplicationUserId == userId, true)
				.SumAsync(x => x.Quantity * (x.ProductDetail.Product.Price * (x.ProductDetail.Product.Saleoff / 100)));
			var total = await _unitOfWork.ShoppingCart.Get(x => x.ApplicationUserId == userId, true)
				.SumAsync(x => x.Quantity * (x.ProductDetail.Product.Price - (x.ProductDetail.Product.Price * (x.ProductDetail.Product.Saleoff / 100))));
			CartResponse cartResponse = new()
			{
				Carts = carts,
				SubTotal = subTotal,
				SaleOffTotal = saleoffTotal,
				Total = total,
			};
			return cartResponse;
		}


	}
}
