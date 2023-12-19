using HNshop.DataAccess.Repository.IRepository;
using HNshop.Models.Response;
using HNshop.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using Microsoft.EntityFrameworkCore;
using HNshop.Models.DTO.Size;
using HNshop.DataAccess.Data;
using HNshop.Utility;
using Microsoft.AspNetCore.Authorization;

namespace HNshop.Controllers.Admin
{
	[Route("api/Admin/[controller]")]
	[ApiController]
	[Authorize(Roles = SD.Role_Admin)]
	public class UserController : ControllerBase
	{
		private readonly IUnitOfWork _unitOfWork;
		private readonly ApplicationDbContext _db;
		public ApiResponse<List<ApplicationUser>> _res;

		public UserController(IUnitOfWork unitOfWork, ApplicationDbContext db)
		{
			_unitOfWork = unitOfWork;
			_db = db;
			_res = new();
		}

		[HttpGet("GetAll")]
		public async Task<IActionResult> GetAll()
		{
			var users = await _db.ApplicationUsers.ToListAsync();

			var userRoles = _db.UserRoles.ToList();
			var roles = _db.Roles.ToList();

			foreach (var user in users)
			{
				var roleId = userRoles.FirstOrDefault(x => x.UserId == user.Id).RoleId;
				user.Role = roles.FirstOrDefault(x => x.Id == roleId).Name;
			}

			_res.Result = users;
			_res.StatusCode = HttpStatusCode.OK;

			return Ok(_res);
		}

		[HttpPost("lockUnlock/{id}")]
		public async Task<IActionResult> LockUnlock(string id)
		{
			var user = await _db.ApplicationUsers.FirstOrDefaultAsync(x => x.Id == id);

			if (user == null)
			{
				_res.IsSuccess= false;
				_res.StatusCode = HttpStatusCode.NotFound;
				return NotFound(_res);
			}
			if (user.LockoutEnd != null && user.LockoutEnd > DateTime.Now)
			{
				//unlock
				user.LockoutEnd = DateTime.Now;
				_res.Messages = $"Unlock user {user.UserName} successfully.";
			}
			else
			{
				//lock
				user.LockoutEnd = DateTime.Now.AddDays(7);
				_res.Messages = $"Lock user {user.UserName} successfully.";
			}
			_db.SaveChanges();

			var users = await _db.ApplicationUsers.ToListAsync();

			var userRoles = _db.UserRoles.ToList();
			var roles = _db.Roles.ToList();

			foreach (var u in users)
			{
				var roleId = userRoles.FirstOrDefault(x => x.UserId == u.Id).RoleId;
				user.Role = roles.FirstOrDefault(x => x.Id == roleId).Name;
			}

			_res.Result = users;
			_res.StatusCode = HttpStatusCode.OK;

			return Ok(_res);
		}
	}
}
