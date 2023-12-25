using HNshop.DataAccess.Repository.IRepository;
using HNshop.Models.Response;
using HNshop.Models;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using Microsoft.EntityFrameworkCore;
using HNshop.Models.DTO.Color;
using HNshop.Utility;
using Microsoft.AspNetCore.Authorization;

namespace HNshop.Controllers.Admin
{
    [Route("api/Admin/[controller]")]
    [ApiController]
	[Authorize(Roles = SD.Role_Admin)]
	public class ColorController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        public ApiResponse<object> _res;

        public ColorController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _res = new();
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
			if (_unitOfWork.Color == null)
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.NotFound;
				return BadRequest(_res);
			}
			_res.Result = await _unitOfWork.Color.GetAll().ToListAsync();
            _res.StatusCode = HttpStatusCode.OK;

            return Ok(_res);
        }


        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromForm] CreateColorDTO colorDTO)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var existsName = await _unitOfWork.Color.Get(x => x.Name.ToLower() == colorDTO.Name.Trim().ToLower(), true).FirstOrDefaultAsync();

                    if (existsName != null)
                    {
                        _res.IsSuccess = false;
                        _res.Result = colorDTO;
						ModelState.AddModelError(nameof(CreateColorDTO.Name), "Name already exists.");
						_res.Errors = ModelState.ToDictionary(
									 kvp => kvp.Key,
									 kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
								 );
						return BadRequest(_res);
                    }
                    Color color = new()
                    {
                        Name = colorDTO.Name,
                    };
                    _unitOfWork.Color.Add(color);
                    _unitOfWork.Save();
                    _res.Result = color;
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
        public async Task<IActionResult> Update(int id, [FromForm] UpdateColorDTO colorDTO)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (colorDTO == null || id != colorDTO.Id)
                    {
                        _res.IsSuccess = false;
                        return BadRequest(_res);
                    }

                    var existsName = await _unitOfWork.Color.Get(x => x.Name.ToLower() == colorDTO.Name.Trim().ToLower(), true).FirstOrDefaultAsync();

                    if (existsName != null && existsName.Id != colorDTO.Id)
                    {
                        _res.IsSuccess = false;
                        _res.Result = colorDTO;
						ModelState.AddModelError(nameof(UpdateColorDTO.Name), "Name already exists.");
						_res.Errors = ModelState.ToDictionary(
									 kvp => kvp.Key,
									 kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
								 );

						return BadRequest(_res);
                    }

                    var colorUpdate = await _unitOfWork.Color.Get(x => x.Id == colorDTO.Id, true).FirstOrDefaultAsync();
                    if (colorUpdate == null)
                    {
                        _res.IsSuccess = false;
                        _res.StatusCode = HttpStatusCode.NotFound;
                        return NotFound(_res);
                    }

                    colorUpdate.Name = colorDTO.Name;
                    _unitOfWork.Color.Update(colorUpdate);
                    _unitOfWork.Save();

                    _res.Result = colorUpdate;
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
            var colorDelete = await _unitOfWork.Color.Get(x => x.Id == id, true).FirstOrDefaultAsync();
            if (colorDelete == null)
            {
                _res.IsSuccess = false;
                _res.StatusCode = HttpStatusCode.NotFound;
                return NotFound(_res);
            }


            _unitOfWork.Color.Remove(colorDelete);
            _unitOfWork.Save();

            _res.StatusCode = HttpStatusCode.OK;
            return Ok(_res);
        }
    }
}
