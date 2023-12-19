using HNshop.DataAccess.Repository.IRepository;
using HNshop.Models.Response;
using HNshop.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using Microsoft.EntityFrameworkCore;
using HNshop.Models.DTO.Size;
using HNshop.Utility;
using Microsoft.AspNetCore.Authorization;

namespace HNshop.Controllers.Admin
{
	[Route("api/Admin/[controller]")]
	[ApiController]
	[Authorize(Roles = SD.Role_Admin)]
	public class OrderController : ControllerBase
	{
		private readonly IUnitOfWork _unitOfWork;
		public ApiResponse<object> _res;

		public OrderController(IUnitOfWork unitOfWork)
		{
			_unitOfWork = unitOfWork;
			_res = new();
		}

		[HttpPost("GetOrders")]
		public async Task<IActionResult> GetOrders([FromForm] string status)
		{
			if (status == null)
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.NotFound;
				return NotFound(_res);
			}

			List<HNshop.Models.Order> orderIndb = null;

			if (status == "All")
			{
				orderIndb = await _unitOfWork.Order.GetAll()
				.Include(x => x.Items)
				.ThenInclude(x => x.ProductDetail.Product.Images)
				.Include(x => x.Items)
				.ThenInclude(x => x.ProductDetail.Product.SubCategory)
				.Include(x => x.Items)
				.ThenInclude(x => x.ProductDetail.Size)
				.OrderByDescending(x => x.Id)
				.ToListAsync();
			}
			else
			{
				orderIndb = await _unitOfWork.Order.Get(x => x.OrderStatus == status, true)
				.Include(x => x.Items)
				.ThenInclude(x => x.ProductDetail.Product.Images)
				.Include(x => x.Items)
				.ThenInclude(x => x.ProductDetail.Product.SubCategory)
				.Include(x => x.Items)
				.ThenInclude(x => x.ProductDetail.Size)
				.OrderByDescending(x => x.Id)
				.ToListAsync();
			}


			if (orderIndb == null)
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.NotFound;
				return NotFound(_res);
			}

			_res.Result = orderIndb;
			_res.StatusCode = HttpStatusCode.OK;
			return Ok(_res);
		}

		[HttpGet("GetOrder/{id}")]
		public async Task<IActionResult> GetOrder(int id)
		{
			if (id == 0)
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.BadRequest;
				return BadRequest(_res);
			}

			var orderInDb = await _unitOfWork.Order.Get(x => x.Id == id, true)
				.Include(x => x.Items)
				.ThenInclude(x => x.ProductDetail.Product.Images)
				.Include(x => x.Items)
				.ThenInclude(x => x.ProductDetail.Product.SubCategory)
				.Include(x => x.Items)
				.ThenInclude(x => x.ProductDetail.Size)
				.FirstOrDefaultAsync();

			if (orderInDb == null)
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.NotFound;
				return NotFound(_res);
			}

			_res.Result = orderInDb;
			_res.StatusCode = HttpStatusCode.OK;
			return Ok(_res);
		}

		[HttpPost("ChangeOrderStatus/{id}")]
		public async Task<IActionResult> GetOrder(int id, [FromForm] string status)
		{
			if (id == 0 || string.IsNullOrEmpty(status))
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.BadRequest;
				return BadRequest(_res);
			}

			if(status == SD.Order_WaitForConfirmation)
			{
				_unitOfWork.Order.UpdateStatus(id, SD.Order_WaitForShip);
			}
			else if (status == SD.Order_WaitForShip)
			{
				_unitOfWork.Order.UpdateStatus(id, SD.Order_Completed);
			}
			_unitOfWork.Save();

			var orderInDb = await _unitOfWork.Order.Get(x => x.Id == id, true)
				.Include(x => x.Items)
				.ThenInclude(x => x.ProductDetail.Product.Images)
				.Include(x => x.Items)
				.ThenInclude(x => x.ProductDetail.Product.SubCategory)
				.Include(x => x.Items)
				.ThenInclude(x => x.ProductDetail.Size)
				.FirstOrDefaultAsync();

			if (orderInDb == null)
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.NotFound;
				return NotFound(_res);
			}

			_res.Result = orderInDb;
			_res.StatusCode = HttpStatusCode.OK;
			return Ok(_res);
		}
	}
}
