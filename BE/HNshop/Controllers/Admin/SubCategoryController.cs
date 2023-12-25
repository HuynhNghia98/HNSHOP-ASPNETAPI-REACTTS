using HNshop.DataAccess.Repository.IRepository;
using HNshop.Models;
using HNshop.Models.DTO.Product;
using HNshop.Models.DTO.Size;
using HNshop.Models.DTO.SubCategory;
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
	public class SubCategoryController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        public ApiResponse<SubCategoryResponse> _res;

        public SubCategoryController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _res = new();
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
			_res.Result.SubCategories = await _unitOfWork.SubCategory.GetAll().ToListAsync();
			_res.Result.Categories = await _unitOfWork.Category.GetAll().ToListAsync();
			_res.StatusCode = HttpStatusCode.OK;

            return Ok(_res);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromForm] CreateSubCategoryDTO subCategoryDTO)
        {
            try
            {
                if (ModelState.IsValid)
                {
					if (subCategoryDTO.CategoryId <= 0)
					{
						_res.IsSuccess = false;
						ModelState.AddModelError(nameof(CreateSubCategoryDTO.CategoryId), "CategoryId is required.");
						_res.Errors = ModelState.ToDictionary(
									 kvp => kvp.Key,
									 kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
								 );
						return BadRequest(_res);
					}
					var existsName = await _unitOfWork.SubCategory.Get(x => x.Name.ToLower() == subCategoryDTO.Name.Trim().ToLower(), true).FirstOrDefaultAsync();

                    if (existsName != null)
                    {
                        _res.IsSuccess = false;
						ModelState.AddModelError(nameof(CreateSubCategoryDTO.Name), "Name already exists.");
						_res.Errors = ModelState.ToDictionary(
									 kvp => kvp.Key,
									 kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
								 );
						return BadRequest(_res);
                    }

                    SubCategory subCategoryCreate = new()
                    {
                        Name = subCategoryDTO.Name,
                        UrlName = subCategoryDTO.UrlName,
                        Description = subCategoryDTO.Description,
                        CategoryId = subCategoryDTO.CategoryId,
                    };
                    _unitOfWork.SubCategory.Add(subCategoryCreate);
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
        public async Task<IActionResult> Update(int id, [FromForm] UpdateSubCategoryDTO subCategoryDTO)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (subCategoryDTO == null || id != subCategoryDTO.Id)
                    {
                        _res.IsSuccess = false;
                        return BadRequest(_res);
                    }

					if (subCategoryDTO.CategoryId <= 0)
					{
						_res.IsSuccess = false;
						ModelState.AddModelError(nameof(UpdateSubCategoryDTO.CategoryId), "CategoryId is required.");
						_res.Errors = ModelState.ToDictionary(
									 kvp => kvp.Key,
									 kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
								 );
						return BadRequest(_res);
					}

					var existsName = await _unitOfWork.SubCategory.Get(x => x.Name.ToLower() == subCategoryDTO.Name.Trim().ToLower(), true).FirstOrDefaultAsync();

                    if (existsName != null && existsName.Id != subCategoryDTO.Id)
                    {
                        _res.IsSuccess = false;
						ModelState.AddModelError(nameof(UpdateSubCategoryDTO.Name), "Name already exists.");
						_res.Errors = ModelState.ToDictionary(
									 kvp => kvp.Key,
									 kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
								 );
						return BadRequest(_res);
                    }

                    var subCategoryUpdate = await _unitOfWork.SubCategory.Get(x => x.Id == subCategoryDTO.Id, true).FirstOrDefaultAsync();
                    if (subCategoryUpdate == null)
                    {
                        _res.IsSuccess = false;
                        _res.StatusCode = HttpStatusCode.NotFound;
                        return NotFound(_res);
                    }

                    subCategoryUpdate.Name = subCategoryDTO.Name;
                    subCategoryUpdate.UrlName = subCategoryDTO.UrlName;
                    subCategoryUpdate.Description = subCategoryDTO.Description;
                    subCategoryUpdate.CategoryId = subCategoryDTO.CategoryId;
                    _unitOfWork.SubCategory.Update(subCategoryUpdate);
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
            var subCategoryDelete = await _unitOfWork.SubCategory.Get(x => x.Id == id, true).FirstOrDefaultAsync();
            if (subCategoryDelete == null)
            {
                _res.IsSuccess = false;
                _res.StatusCode = HttpStatusCode.NotFound;
                return NotFound(_res);
            }


            _unitOfWork.SubCategory.Remove(subCategoryDelete);
            _unitOfWork.Save();

            _res.StatusCode = HttpStatusCode.OK;
            return Ok(_res);
        }
    }
}
