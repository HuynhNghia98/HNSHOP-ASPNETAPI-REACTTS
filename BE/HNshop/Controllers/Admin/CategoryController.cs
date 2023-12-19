using HNshop.DataAccess.Repository.IRepository;
using HNshop.Models;
using HNshop.Models.DTO.Category;
using HNshop.Models.Response;
using HNshop.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace HNshop.Controllers.Admin
{
	[Route("api/Admin/[controller]")]
	[ApiController]
	[Authorize(Roles = SD.Role_Admin)]
	public class CategoryController : ControllerBase
	{
		private readonly IUnitOfWork _unitOfWork;
		public ApiResponse<List<Category>> _res;

		public CategoryController(IUnitOfWork unitOfWork)
		{
			_unitOfWork = unitOfWork;
			_res = new();
		}

		[HttpGet("GetAll")]
		public async Task<IActionResult> GetAll()
		{
			if (_unitOfWork.Category == null)
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.NotFound;
				return BadRequest(_res);
			}
			_res.Result = await _unitOfWork.Category.GetAll().ToListAsync();
			_res.StatusCode = HttpStatusCode.OK;

			return Ok(_res);
		}


		[HttpPost("Create")]
		public async Task<IActionResult> Create([FromForm] CreateSubCategoryDTO categoryDTO)
		{
			try
			{
				if (ModelState.IsValid)
				{
					var existsName = await _unitOfWork.Category.Get(x => x.Name.ToLower() == categoryDTO.Name.Trim().ToLower(), true).FirstOrDefaultAsync();

					if (existsName != null)
					{
						_res.StatusCode = HttpStatusCode.BadRequest;
						_res.IsSuccess = false;
						ModelState.AddModelError(nameof(categoryDTO.Name), "Tên đã tồn tại.");
						_res.Errors = ModelState.ToDictionary(
							kvp => kvp.Key,
							kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
						);
						return BadRequest(_res);
					}

					Category categoryCreate = new()
					{
						Name = categoryDTO.Name,
						UrlName = categoryDTO.UrlName,
						Description = categoryDTO.Description,
					};
					_unitOfWork.Category.Add(categoryCreate);
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
		public async Task<IActionResult> Update(int id, [FromForm] UpdateSubCategoryDTO categoryDTO)
		{
			try
			{
				if (ModelState.IsValid)
				{
					if (categoryDTO == null)
					{
						_res.StatusCode = HttpStatusCode.BadRequest;
						_res.IsSuccess = false;
						return BadRequest(_res);
					}

					var existsName = await _unitOfWork.Category.Get(x => x.Name.ToLower() == categoryDTO.Name.Trim().ToLower(), true).FirstOrDefaultAsync();

					if (existsName != null && id != existsName.Id)
					{
						ModelState.AddModelError(nameof(categoryDTO.Name), "Tên đã tồn tại.");
						_res.StatusCode = HttpStatusCode.BadRequest;
						_res.IsSuccess = false;
						_res.Errors = ModelState.ToDictionary(
							kvp => kvp.Key,
							kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
						);

						return BadRequest(_res);
					}

					var categoryUpdate = await _unitOfWork.Category.Get(x => x.Id == categoryDTO.Id, true).FirstOrDefaultAsync();
					if (categoryUpdate == null)
					{
						_res.IsSuccess = false;
						_res.StatusCode = HttpStatusCode.NotFound;
						return NotFound(_res);
					}

					categoryUpdate.Name = categoryDTO.Name;
					categoryUpdate.UrlName = categoryDTO.UrlName;
					categoryUpdate.Description = categoryDTO.Description;
					_unitOfWork.Category.Update(categoryUpdate);
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
			if (id == 0)
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.NotFound;
				return NotFound(_res);
			}
			var categoryDelete = await _unitOfWork.Category.Get(x => x.Id == id, true).FirstOrDefaultAsync();
			if (categoryDelete == null)
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.NotFound;
				return NotFound(_res);
			}

			_unitOfWork.Category.Remove(categoryDelete);
			_unitOfWork.Save();

			_res.StatusCode = HttpStatusCode.OK;
			return Ok(_res);
		}
	}
}
