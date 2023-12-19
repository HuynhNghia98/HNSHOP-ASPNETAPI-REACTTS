using HNshop.DataAccess.Repository.IRepository;
using HNshop.Models.Response;
using HNshop.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using Microsoft.EntityFrameworkCore;
using HNshop.Models.DTO.Size;
using HNshop.Models.DTO.ProductDetail;
using HNshop.Utility;
using Microsoft.AspNetCore.Authorization;

namespace HNshop.Controllers.Admin
{
    [Route("api/Admin/[controller]")]
    [ApiController]
	[Authorize(Roles = SD.Role_Admin)]
	public class SizeController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        public ApiResponse<object> _res;

        public SizeController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _res = new();
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
			if (_unitOfWork.Size == null)
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.NotFound;
				return BadRequest(_res);
			}
			_res.Result = await _unitOfWork.Size.GetAll().ToListAsync();
            _res.StatusCode = HttpStatusCode.OK;

            return Ok(_res);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromForm] CreateSizeDTO sizeDTO)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var existsName = await _unitOfWork.Size.Get(x => x.Name.ToLower() == sizeDTO.Name.Trim().ToLower(), true).FirstOrDefaultAsync();

                    if (existsName != null)
                    {
                        _res.IsSuccess = false;
                        _res.Result = sizeDTO;
						ModelState.AddModelError(nameof(CreateSizeDTO.Name), "Tên đã tồn tại.");
						_res.Errors = ModelState.ToDictionary(
									 kvp => kvp.Key,
									 kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
								 );
						return BadRequest(_res);
                    }
                    Size size = new()
                    {
                        Name = sizeDTO.Name,
                    };
                    _unitOfWork.Size.Add(size);
                    _unitOfWork.Save();
                    _res.Result = size;
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
        public async Task<IActionResult> Update(int id, [FromForm] UpdateSizeDTO sizeDTO)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (sizeDTO == null || id != sizeDTO.Id)
                    {
                        _res.IsSuccess = false;
                        return BadRequest(_res);
                    }

                    var existsName = await _unitOfWork.Size.Get(x => x.Name.ToLower() == sizeDTO.Name.Trim().ToLower(), true).FirstOrDefaultAsync();

                    if (existsName != null && existsName.Id != sizeDTO.Id)
                    {
                        _res.IsSuccess = false;
                        _res.Result = sizeDTO;
						ModelState.AddModelError(nameof(UpdateSizeDTO.Name), "Tên đã tồn tại.");
						_res.Errors = ModelState.ToDictionary(
									 kvp => kvp.Key,
									 kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
								 );
						return BadRequest(_res);
                    }

                    var sizeUpdate = await _unitOfWork.Size.Get(x => x.Id == sizeDTO.Id, true).FirstOrDefaultAsync();
                    if (sizeUpdate == null)
                    {
                        _res.IsSuccess = false;
                        _res.StatusCode = HttpStatusCode.NotFound;
                        return NotFound(_res);
                    }

                    sizeUpdate.Name = sizeDTO.Name;
                    _unitOfWork.Size.Update(sizeUpdate);
                    _unitOfWork.Save();

                    _res.Result = sizeUpdate;
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
            var sizeDelete = await _unitOfWork.Size.Get(x => x.Id == id, true).FirstOrDefaultAsync();
            if (sizeDelete == null)
            {
                _res.IsSuccess = false;
                _res.StatusCode = HttpStatusCode.NotFound;
                return NotFound(_res);
            }


            _unitOfWork.Size.Remove(sizeDelete);
            _unitOfWork.Save();

            _res.StatusCode = HttpStatusCode.OK;
            return Ok(_res);
        }
    }
}
