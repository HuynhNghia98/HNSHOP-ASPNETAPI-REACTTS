using HNshop.DataAccess.Repository.IRepository;
using HNshop.Models;
using HNshop.Models.Response;
using HNshop.Utility;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Net;

namespace HNshop.Controllers.Customer
{
	[Route("api/Customer/[controller]")]
	[ApiController]
	public class SubCategoryCustomerController : ControllerBase
	{
		private readonly IUnitOfWork _unitOfWork;
		public ApiResponse<SubCategoryCustomerResponse> _res;
		public int PageSize = 4;

		public SubCategoryCustomerController(IUnitOfWork unitOfWork)
		{
			_unitOfWork = unitOfWork;
			_res = new();
		}

		[HttpGet("Get/{urlName}")]
		public async Task<IActionResult> GetAll(string urlName)
		{
			if (string.IsNullOrEmpty(urlName))
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.NotFound;
				return BadRequest(_res);
			}
			var subCategory = await _unitOfWork.SubCategory.Get(x => x.UrlName == urlName, true).FirstOrDefaultAsync();
			if (subCategory == null)
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.NotFound;
				return BadRequest(_res);
			}

			var products = _unitOfWork.Product.Get(u => u.SubCategory.UrlName == urlName, true).Include(u => u.Images)
					.Include(u => u.Color).Include(u => u.SubCategory);

			var paginatedProduct = await PaginatedList<Product>.CreateAsync(products, 1, PageSize);

			_res.Result.Products = paginatedProduct;
			_res.Result.PageIndex = 1;
			_res.Result.TotalPages = paginatedProduct.TotalPages;
			_res.Result.HasPreviousPage = paginatedProduct.HasPreviousPage;
			_res.Result.HasNextPage = paginatedProduct.HasNextPage;
			_res.Result.ProductColors = await _unitOfWork.Product.Get(u => u.SubCategory.UrlName == urlName, true)
			.Include(u => u.Color)
			.ToListAsync();
			_res.Result.SubCategory = subCategory;
			_res.StatusCode = HttpStatusCode.OK;

			return Ok(_res);
		}

		[HttpPost("Filter/{urlName}")]
		public async Task<IActionResult> Filter(string urlName, [FromForm] string? price, [FromForm] int? color, [FromForm] string? sort, [FromForm] int? pageNumber)
		{
			if (string.IsNullOrEmpty(urlName))
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.NotFound;
				return BadRequest(_res);
			}
			var subCategory = await _unitOfWork.SubCategory.Get(x => x.UrlName == urlName, true).FirstOrDefaultAsync();
			if (subCategory == null)
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.NotFound;
				return BadRequest(_res);
			}
			var productFilter = _unitOfWork.Product.Get(u => u.SubCategory.UrlName == urlName, true);
			if (price != null && !string.IsNullOrEmpty(price))
			{
				switch (price)
				{
					case "price1":
						productFilter = productFilter.Where(u => u.Price >= 0 && u.Price <= 50);
						break;
					case "price2":
						productFilter = productFilter.Where(u => u.Price > 50 && u.Price <= 100);
						break;
					case "price3":
						productFilter = productFilter.Where(u => u.Price > 100 && u.Price <= 500);
						break;
					default:
						productFilter = productFilter.Where(u => u.Price > 500);
						break;
				}
			}
			if (color != null && color != 0)
			{
				productFilter = productFilter.Where(u => u.Color.Id == color);
			}
			if (sort != null && !string.IsNullOrEmpty(sort))
			{
				switch (sort)
				{
					case "asc":
						productFilter = productFilter.OrderBy(u => u.Price);
						break;
					case "desc":
						productFilter = productFilter.OrderByDescending(u => u.Price);
						break;
					case "az":
						productFilter = productFilter.OrderBy(u => u.Name);
						break;
					default:
						productFilter = productFilter.OrderByDescending(u => u.Name);
						break;
				}
			}
			var filteredProducts = productFilter
					.Include(u => u.Images)
					.Include(u => u.Color)
					.Include(u => u.SubCategory);
			var paginatedProduct = await PaginatedList<Product>.CreateAsync(filteredProducts, pageNumber ?? 1, PageSize);

			_res.Result.Products = paginatedProduct;
			_res.Result.PageIndex = pageNumber ?? 1;
			_res.Result.TotalPages = paginatedProduct.TotalPages;
			_res.Result.HasPreviousPage = paginatedProduct.HasPreviousPage;
			_res.Result.HasNextPage = paginatedProduct.HasNextPage;
			_res.Result.ProductColors = await _unitOfWork.Product.Get(u => u.SubCategory.UrlName == urlName, true)
			.Include(u => u.Color)
			.ToListAsync();
			_res.Result.SubCategory = subCategory;
			_res.StatusCode = HttpStatusCode.OK;

			return Ok(_res);
		}
	}
}
