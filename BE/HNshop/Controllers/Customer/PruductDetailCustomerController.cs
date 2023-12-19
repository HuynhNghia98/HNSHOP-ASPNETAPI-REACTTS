using HNshop.DataAccess.Repository.IRepository;
using HNshop.Models.Response;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace HNshop.Controllers.Customer
{
	[Route("api/Customer/[controller]")]
	[ApiController]
	public class ProductDetailCustomerController : ControllerBase
	{
		private readonly IUnitOfWork _unitOfWork;
		public ApiResponse<ProductDetailCustomerResponse> _res;

		public ProductDetailCustomerController(IUnitOfWork unitOfWork)
		{
			_unitOfWork = unitOfWork;
			_res = new();
		}

		[HttpGet("Get/{slug}")]
		public async Task<IActionResult> GetAll(string slug)
		{
			if (slug == null || string.IsNullOrEmpty(slug))
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.NotFound;
				return NotFound(_res);
			}

			var product = await _unitOfWork.Product.Get(x => x.Slug == slug, true).Include(x => x.Images).Include(x => x.Color).Include(x => x.SubCategory).FirstOrDefaultAsync();

			if (product == null)
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.NotFound;
				return NotFound(_res);
			}

			_res.Result.Product = product;
			_res.Result.ProductDetails = await _unitOfWork.ProductDetail.Get(x => x.Product.Slug == slug, true).Include(x => x.Size).ToListAsync();
			_res.Result.Products = await _unitOfWork.Product.Get(x => x.SubCategoryId == product.SubCategoryId && x.Id != product.Id, true).ToListAsync();
			_res.StatusCode = HttpStatusCode.OK;

			return Ok(_res);
		}
	}
}
