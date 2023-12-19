using HNshop.DataAccess.Data;
using HNshop.DataAccess.Repository.IRepository;
using HNshop.Models.DTO.User;
using HNshop.Models.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace HNshop.Controllers.User
{
	[Route("api/[controller]")]
	[ApiController]
	[Authorize]
	public class ManageController : ControllerBase
	{
		private readonly IUnitOfWork _unitOfWork;
		private readonly ApplicationDbContext _db;
		public ApiResponse<object> _res;
		public ManageController(IUnitOfWork unitOfWork, ApplicationDbContext db)
		{
			_unitOfWork = unitOfWork;
			_db = db;
			_res = new();
		}

		[HttpGet("GetUserInfor/{userId}")]
		public async Task<IActionResult> GetUserInfo(string userId)
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

			UserInforResponseDTO userInforResponseDTO = new()
			{
				UserName = userInDb.UserName,
				PhoneNumber = userInDb.PhoneNumber,
				Name = userInDb.Name,
				StreetAddress = userInDb.StreetAddress,
				City = userInDb.City,
				PostalCode = userInDb.PostalCode,
			};

			_res.Result = userInforResponseDTO;
			_res.StatusCode = HttpStatusCode.OK;
			return Ok(_res);
		}

		[HttpPost("ChangeUserInfor/{userId}")]
		public async Task<IActionResult> ChangeUserInfor(string userId, [FromForm] ChangeUserInforRequestDTO changeUserInforRequestDTO)
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

			userInDb.Name = changeUserInforRequestDTO.Name;
			userInDb.PhoneNumber = changeUserInforRequestDTO.PhoneNumber;
			userInDb.StreetAddress = changeUserInforRequestDTO.StreetAddress;
			userInDb.City = changeUserInforRequestDTO.City;
			userInDb.PostalCode = changeUserInforRequestDTO.PostalCode;

			_db.Users.Update(userInDb);
			_db.SaveChanges();

			UserInforResponseDTO userInforResponseDTO = new()
			{
				UserName = userInDb.UserName,
				PhoneNumber = userInDb.PhoneNumber,
				Name = userInDb.Name,
				StreetAddress = userInDb.StreetAddress,
				City = userInDb.City,
				PostalCode = userInDb.PostalCode,
			};

			_res.StatusCode = HttpStatusCode.OK;
			_res.Result = userInforResponseDTO;
			return Ok(_res);
		}

		[HttpPost("GetOrders/{userId}")]
		public async Task<IActionResult> GetOrders(string userId, [FromForm] string status)
		{
			if (userId == null)
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.NotFound;
				return NotFound(_res);
			}

			var orderIndb = await _unitOfWork.Order.Get(x => x.ApplicationUserId == userId && x.OrderStatus == status, true)
				.Include(x => x.Items)
				.ThenInclude(x => x.ProductDetail.Product.Images)
				.Include(x => x.Items)
				.ThenInclude(x => x.ProductDetail.Product.SubCategory)
				.Include(x => x.Items)
				.ThenInclude(x => x.ProductDetail.Size)
				.OrderByDescending(x => x.Id)
				.ToListAsync();

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
	}
}
