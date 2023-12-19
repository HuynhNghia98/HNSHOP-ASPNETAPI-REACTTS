using HNshop.DataAccess.Repository.IRepository;
using HNshop.Models.Response;
using HNshop.Models;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using Microsoft.EntityFrameworkCore;
using HNshop.Models.DTO.ProductDetail;
using HNshop.Utility;
using Microsoft.AspNetCore.Authorization;

namespace HNshop.Controllers.Admin
{
	[Route("api/Admin/[controller]")]
	[ApiController]
	[Authorize(Roles = SD.Role_Admin)]
	public class ProductDetailController : ControllerBase
	{
		private readonly IUnitOfWork _unitOfWork;
		public ApiResponse<ProductDetailResponse> _res;

		public ProductDetailController(IUnitOfWork unitOfWork)
		{
			_unitOfWork = unitOfWork;
			_res = new();
		}

		[HttpGet("GetAll")]
		public async Task<IActionResult> GetAll()
		{
			if (_unitOfWork.ProductDetail == null || _unitOfWork.Product == null|| _unitOfWork.Size == null)
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.NotFound;
				return BadRequest(_res);
			}
			_res.Result.ProductDetails = await _unitOfWork.ProductDetail.GetAll().Include(x=>x.Product).Include(x => x.Size).ToListAsync();
			_res.Result.Products = await _unitOfWork.Product.GetAll().ToListAsync();
			_res.Result.Sizes = await _unitOfWork.Size.GetAll().ToListAsync();
			_res.StatusCode = HttpStatusCode.OK;

			return Ok(_res);
		}

		[HttpPost("Create")]
		public async Task<IActionResult> Create([FromForm] CreateProductDetailDTO productDetailDTO)
		{
			try
			{
				if (ModelState.IsValid)
				{
					if(productDetailDTO==null)
					{
						_res.IsSuccess = false;
						return BadRequest(_res);
					}

					if (productDetailDTO.ProductId <=0)
					{
						_res.IsSuccess = false;
						ModelState.AddModelError(nameof(CreateProductDetailDTO.ProductId), "Product is required.");
						_res.Errors = ModelState.ToDictionary(
									 kvp => kvp.Key,
									 kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
								 );
						return BadRequest(_res);
					}

					if (productDetailDTO.SizeId <= 0)
					{
						_res.IsSuccess = false;
						ModelState.AddModelError(nameof(CreateProductDetailDTO.SizeId), "Size is required.");
						_res.Errors = ModelState.ToDictionary(
									 kvp => kvp.Key,
									 kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
								 );
						return BadRequest(_res);
					}


					if (productDetailDTO.Quantity <= 0)
					{
						_res.IsSuccess = false;
						ModelState.AddModelError(nameof(CreateProductDetailDTO.Quantity), "Quantity > 0 .");
						_res.Errors = ModelState.ToDictionary(
									 kvp => kvp.Key,
									 kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
								 );
						return BadRequest(_res);
					}

					var existsProductDetail = await _unitOfWork.ProductDetail.Get(x => x.ProductId == productDetailDTO.ProductId && x.SizeId == productDetailDTO.SizeId, true)
						.FirstOrDefaultAsync();

					if (existsProductDetail != null)
					{
						_res.IsSuccess = false;
						ModelState.AddModelError(nameof(CreateProductDetailDTO.ProductId), "The product with the above size already exists.");
						_res.Errors = ModelState.ToDictionary(
									 kvp => kvp.Key,
									 kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
								 );
						return BadRequest(_res);
					}
					ProductDetail productDetail = new()
					{
						Quantity = productDetailDTO.Quantity,
						ProductId = productDetailDTO.ProductId,
						SizeId = productDetailDTO.SizeId,
					};
					_unitOfWork.ProductDetail.Add(productDetail);
					_unitOfWork.Save();
					_res.StatusCode = HttpStatusCode.Created;
					return Ok(_res);
				}
				_res.IsSuccess = false;
			}
			catch (Exception ex)
			{
				_res.IsSuccess = false;
				_res.Errors = ModelState.ToDictionary(
									 kvp => kvp.Key,
									 kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
								 );
			}
			return BadRequest(_res);
		}

		[HttpPut("Update/{id}")]
		public async Task<IActionResult> Update(int id, [FromForm] UpdateProductDetailDTO productDetailDTO)
		{
			try
			{
				if (ModelState.IsValid)
				{
					if (productDetailDTO == null || id != productDetailDTO.Id)
					{
						_res.IsSuccess = false;
						return BadRequest(_res);
					}

					if (productDetailDTO.ProductId <= 0)
					{
						_res.IsSuccess = false;
						ModelState.AddModelError(nameof(CreateProductDetailDTO.ProductId), "Product is required.");
						_res.Errors = ModelState.ToDictionary(
									 kvp => kvp.Key,
									 kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
								 );
						return BadRequest(_res);
					}

					if (productDetailDTO.SizeId <= 0)
					{
						_res.IsSuccess = false;
						ModelState.AddModelError(nameof(CreateProductDetailDTO.SizeId), "Size is required.");
						_res.Errors = ModelState.ToDictionary(
									 kvp => kvp.Key,
									 kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
								 );
						return BadRequest(_res);
					}

					if (productDetailDTO.Quantity <= 0)
					{
						_res.IsSuccess = false;
						ModelState.AddModelError(nameof(CreateProductDetailDTO.Quantity), "Quantity > 0 .");
						_res.Errors = ModelState.ToDictionary(
									 kvp => kvp.Key,
									 kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
								 );
						return BadRequest(_res);
					}

					var existsProductDetail = await _unitOfWork.ProductDetail.Get(x => x.ProductId == productDetailDTO.ProductId && x.SizeId == productDetailDTO.SizeId, true)
						.FirstOrDefaultAsync();

					if (existsProductDetail != null && existsProductDetail.Id != productDetailDTO.Id)
					{
						_res.IsSuccess = false;
						ModelState.AddModelError(nameof(UpdateProductDetailDTO.ProductId), "The product with the above size already exists.");
						_res.Errors = ModelState.ToDictionary(
									 kvp => kvp.Key,
									 kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
								 );
						return BadRequest(_res);
					}

					var productDetailUpdate = await _unitOfWork.ProductDetail.Get(x => x.Id == productDetailDTO.Id, true).FirstOrDefaultAsync();
					if (productDetailUpdate == null)
					{
						_res.IsSuccess = false;
						_res.StatusCode = HttpStatusCode.NotFound;
						return NotFound(_res);
					}

					productDetailUpdate.Quantity = productDetailDTO.Quantity;
					productDetailUpdate.ProductId = productDetailDTO.ProductId;
					productDetailUpdate.SizeId = productDetailDTO.SizeId;
					_unitOfWork.ProductDetail.Update(productDetailUpdate);
					_unitOfWork.Save();

					_res.StatusCode = HttpStatusCode.OK;
					return Ok(_res);
				}
				_res.IsSuccess = false;
			}
			catch (Exception ex)
			{
				_res.IsSuccess = false;
				_res.Errors = ModelState.ToDictionary(
									 kvp => kvp.Key,
									 kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
								 );
			}
			return BadRequest(_res);
		}

		[HttpDelete("Delete/{id}")]
		public async Task<IActionResult> Delete(int id)
		{
			var productDetailDelete = await _unitOfWork.ProductDetail.Get(x => x.Id == id, true).FirstOrDefaultAsync();
			if (productDetailDelete == null)
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.NotFound;
				return NotFound(_res);
			}

			_unitOfWork.ProductDetail.Remove(productDetailDelete);
			_unitOfWork.Save();

			_res.StatusCode = HttpStatusCode.OK;
			return Ok(_res);
		}
	}
}
