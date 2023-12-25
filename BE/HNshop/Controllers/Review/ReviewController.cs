using HNshop.DataAccess.Repository.IRepository;
using HNshop.Models;
using HNshop.Models.DTO.Order;
using HNshop.Models.DTO.Review;
using HNshop.Models.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace HNshop.Controllers.Review
{
	[Route("api/[controller]")]
	[ApiController]
	public class ReviewController : ControllerBase
	{
		private readonly IUnitOfWork _unitOfWork;
		public ApiResponse<object> _res;
		public ReviewController(IUnitOfWork unitOfWork)
		{
			_unitOfWork = unitOfWork;
			_res = new();
		}

		[HttpPost("AddReview")]
		public IActionResult AddReview([FromForm] ReviewRequestDTO reviewRequest)
		{
			var productInDb = _unitOfWork.Product.Get(x => x.Id == reviewRequest.ProductId, true).FirstOrDefault();

			if (productInDb == null)
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.NotFound;
				return NotFound(_res);
			}

			var itemInDb = _unitOfWork.Item.Get(x => x.Id == reviewRequest.ItemId, true).FirstOrDefault();

			if (itemInDb == null)
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.NotFound;
				return NotFound(_res);
			}

			if (reviewRequest.Rating <= 0)
			{
				_res.IsSuccess = false;
				ModelState.AddModelError(nameof(ReviewRequestDTO.Rating), "Rating required.");
				_res.Errors = ModelState.ToDictionary(
					kvp => kvp.Key,
					kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
				);
				_res.StatusCode = HttpStatusCode.BadRequest;
				return BadRequest(_res);
			}
			//add review
			HNshop.Models.Review review = new()
			{
				Rating = reviewRequest.Rating,
				Title = reviewRequest.Title,
				Description = reviewRequest.Description,
				ApplicationUserId = reviewRequest.UserId,
				ProductId = reviewRequest.ProductId,
			};
			_unitOfWork.Review.Add(review);
			//update item
			itemInDb.isReview = true;
			_unitOfWork.Item.Update(itemInDb);
			//savechanges
			_unitOfWork.Save();

			_res.StatusCode = HttpStatusCode.OK;
			return Ok(_res);
		}
	}
}
