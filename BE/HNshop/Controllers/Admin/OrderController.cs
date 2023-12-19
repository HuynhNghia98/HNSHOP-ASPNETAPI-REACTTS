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

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            _res.Result = await _unitOfWork.Order.GetAll().ToListAsync();
            _res.StatusCode = HttpStatusCode.OK;

            return Ok(_res);
        }

        [HttpGet("Get/{{id}}")]
        public async Task<IActionResult> Get(int id)
        {
            if (id == 0)
            {
                _res.StatusCode = HttpStatusCode.BadRequest;
                _res.IsSuccess = false;
                return BadRequest(_res);
            }
            var order = _unitOfWork.Order.Get(x => x.Id == id, true).FirstOrDefault();
            if (order == null)
            {
                _res.StatusCode = HttpStatusCode.NotFound;
                _res.IsSuccess = false;
                return NotFound(_res);
            }
            _res.Result = order;
            _res.StatusCode = HttpStatusCode.OK;
            return Ok(_res);
        }

        //[HttpPost("ChangeInfo")]
        //public async Task<ActionResult<ApiResponse>> Create([FromForm] CreateProductDTO sizeDTO)
        //{
        //	try
        //	{
        //		if (ModelState.IsValid)
        //		{
        //			var existsName = await _unitOfWork.Size.Get(x => x.Name.ToLower() == sizeDTO.Name.Trim().ToLower(), true).FirstOrDefaultAsync();

        //			if (existsName != null)
        //			{
        //				_res.IsSuccess = false;
        //				_res.Result = sizeDTO;
        //				_res.ErrorMessages.Add("Tên đã tồn tại.");
        //				return BadRequest(_res);
        //			}
        //			Size size = new()
        //			{
        //				Name = sizeDTO.Name,
        //			};
        //			_unitOfWork.Size.Add(size);
        //			_unitOfWork.Save();
        //			_res.Result = size;
        //			_res.StatusCode = HttpStatusCode.Created;
        //			return Ok(_res);
        //		}
        //		_res.IsSuccess = false;
        //	}
        //	catch (Exception ex)
        //	{
        //		_res.IsSuccess = false;
        //		_res.ErrorMessages = new List<string>() { ex.ToString() };
        //	}
        //	return BadRequest(_res);
        //}
    }
}
