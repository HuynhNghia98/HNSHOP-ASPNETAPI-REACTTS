using HNshop.DataAccess.Repository;
using HNshop.DataAccess.Repository.IRepository;
using HNshop.Models;
using HNshop.Models.DTO.Product;
using HNshop.Models.Response;
using HNshop.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Reflection;
using System.Text.Json.Serialization;
using System.Text.Json;
using HNshop.Models.DTO.Color;

namespace HNshop.Controllers.Admin
{
	[Route("api/Admin/[controller]")]
	[ApiController]
	[Authorize(Roles = SD.Role_Admin)]
	public class ProductController : ControllerBase
	{
		private readonly IUnitOfWork _unitOfWork;
		private readonly IWebHostEnvironment _webHost;
		public ApiResponse<ProductResponse> _res;

		public ProductController(IUnitOfWork unitOfWork, IWebHostEnvironment webHost)
		{
			_unitOfWork = unitOfWork;
			_res = new();
			_webHost = webHost;
		}

		[HttpGet("GetAll")]
		public async Task<IActionResult> GetAll()
		{
			if (_unitOfWork.Product == null || _unitOfWork.SubCategory == null || _unitOfWork.Color == null)
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.NotFound;
				return BadRequest(_res);
			}
			_res.Result.Products = await _unitOfWork.Product.GetAll().Include(x => x.Images).ToListAsync();
			_res.Result.SubCategories = await _unitOfWork.SubCategory.GetAll().ToListAsync();
			_res.Result.Colors = await _unitOfWork.Color.GetAll().ToListAsync();
			_res.StatusCode = HttpStatusCode.OK;

			return Ok(_res);
		}

		[HttpPost("Create")]
		public async Task<IActionResult> Create([FromForm] CreateProductDTO productDTO)
		{
			try
			{
				if (ModelState.IsValid)
				{
					var existsName = await _unitOfWork.Product.Get(x => x.Name.ToLower() == productDTO.Name.Trim().ToLower(), true).FirstOrDefaultAsync();

					if (existsName != null)
					{
						_res.IsSuccess = false;
						ModelState.AddModelError(nameof(CreateProductDTO.Name), "Name already exists.");
						_res.Errors = ModelState.ToDictionary(
									 kvp => kvp.Key,
									 kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
								 );
						return BadRequest(_res);
					}

					if (productDTO.Price <= 0)
					{
						_res.IsSuccess = false;
						ModelState.AddModelError(nameof(CreateProductDTO.Price), "Price > 0.");
						_res.Errors = ModelState.ToDictionary(
									 kvp => kvp.Key,
									 kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
								 );
						return BadRequest(_res);
					}
					if (productDTO.SubCategoryId <= 0)
					{
						_res.IsSuccess = false;
						ModelState.AddModelError(nameof(CreateProductDTO.SubCategoryId), "SubCategoryId is required.");
						_res.Errors = ModelState.ToDictionary(
									 kvp => kvp.Key,
									 kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
								 );
						return BadRequest(_res);
					}
					if (productDTO.ColorId <= 0)
					{
						_res.IsSuccess = false;
						ModelState.AddModelError(nameof(CreateProductDTO.ColorId), "ColorId is required.");
						_res.Errors = ModelState.ToDictionary(
									 kvp => kvp.Key,
									 kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
								 );
						return BadRequest(_res);
					}

					Product productCreate = new()
					{
						Name = productDTO.Name,
						Price = productDTO.Price,
						Saleoff = productDTO.Saleoff,
						SubCategoryId = productDTO.SubCategoryId,
						ColorId = productDTO.ColorId,
						Description = productDTO.Description
					};
					_unitOfWork.Product.Add(productCreate);
					_unitOfWork.Save();

					if (productCreate.Id > 0)
					{
						productCreate.GenerateSlug();
						_unitOfWork.Product.Update(productCreate);
						_unitOfWork.Save();
					}

					if (productDTO.Files != null && productDTO.Files.Count > 0)
					{
						//root path
						string wwwRootPath = _webHost.WebRootPath;
						string productPath = Path.Combine(wwwRootPath, @"images");

						var proId = _unitOfWork.Product.Get(u => u.Name == productDTO.Name, true).FirstOrDefault().Id;

						//add image to db, root
						foreach (var file in productDTO.Files)
						{
							if (file != null && file.Length > 0)
							{
								string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
								using (var fileStream = new FileStream(Path.Combine(productPath, fileName), FileMode.Create))
								{
									file.CopyTo(fileStream);
								}

								Image image = new Image();
								image.ImageUrl = @"\images\" + fileName;

								if (proId != null)
								{
									image.ProductId = proId;
									_unitOfWork.Image.Add(image);
								}
								else
								{
									_res.IsSuccess = false;
									ModelState.AddModelError(nameof(CreateProductDTO.Name), "Product does not exist .");
									_res.Errors = ModelState.ToDictionary(
												 kvp => kvp.Key,
												 kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
											 );
									return NotFound(_res);
								}
							}
						}
						_unitOfWork.Save();
					}

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
		public async Task<IActionResult> Update(int id, [FromForm] UpdateProductDTO productDTO)
		{
			try
			{
				if (ModelState.IsValid)
				{
					if (productDTO == null || id != productDTO.Id)
					{
						_res.IsSuccess = false;
						return BadRequest(_res);
					}

					if (productDTO.Price <= 0)
					{
						_res.IsSuccess = false;
						ModelState.AddModelError(nameof(UpdateProductDTO.Price), "Price > 0.");
						_res.Errors = ModelState.ToDictionary(
									 kvp => kvp.Key,
									 kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
								 );
						return BadRequest(_res);
					}

					if (productDTO.SubCategoryId <= 0)
					{
						_res.IsSuccess = false;
						ModelState.AddModelError(nameof(CreateProductDTO.SubCategoryId), "SubCategoryId is required.");
						_res.Errors = ModelState.ToDictionary(
									 kvp => kvp.Key,
									 kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
								 );
						return BadRequest(_res);
					}
					if (productDTO.ColorId <= 0)
					{
						_res.IsSuccess = false;
						ModelState.AddModelError(nameof(CreateProductDTO.ColorId), "ColorId is required.");
						_res.Errors = ModelState.ToDictionary(
									 kvp => kvp.Key,
									 kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
								 );
						return BadRequest(_res);
					}

					var existsName = await _unitOfWork.Product.Get(x => x.Name.ToLower() == productDTO.Name.Trim().ToLower(), true).FirstOrDefaultAsync();

					if (existsName != null && existsName.Id != productDTO.Id)
					{
						_res.IsSuccess = false;
						ModelState.AddModelError(nameof(UpdateProductDTO.Name), "Name already exists.");
						_res.Errors = ModelState.ToDictionary(
									 kvp => kvp.Key,
									 kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
								 );
						return BadRequest(_res);
					}

					var productUpdate = await _unitOfWork.Product.Get(x => x.Id == productDTO.Id, true).FirstOrDefaultAsync();
					if (productUpdate == null)
					{
						_res.IsSuccess = false;
						_res.StatusCode = HttpStatusCode.NotFound;
						return NotFound(_res);
					}

					productUpdate.Name = productDTO.Name;
					productUpdate.Price = productDTO.Price;
					productUpdate.Saleoff = productDTO.Saleoff;
					productUpdate.SubCategoryId = productDTO.SubCategoryId;
					productUpdate.ColorId = productDTO.ColorId;
					productUpdate.Description = productDTO.Description;
					productUpdate.GenerateSlug();
					_unitOfWork.Product.Update(productUpdate);
					_unitOfWork.Save();

					if (productDTO.Files != null && productDTO.Files.Count > 0)
					{
						//root path
						string wwwRootPath = _webHost.WebRootPath;
						string productPath = Path.Combine(wwwRootPath, @"images");
						//remove Images
						var images = await _unitOfWork.Image.Get(x => x.ProductId == productUpdate.Id, true).ToListAsync();
						foreach (var item in images)
						{
							// Get the full path of the image file
							string imagePath = Path.Combine(wwwRootPath, item.ImageUrl.TrimStart('\\'));

							// Check if the file exists before attempting to delete
							if (System.IO.File.Exists(imagePath))
							{
								System.IO.File.Delete(imagePath);
							}
						}
						_unitOfWork.Image.RemoveRange(images);
						_unitOfWork.Save();

						var proId = await _unitOfWork.Product.Get(u => u.Name == productDTO.Name, true).FirstOrDefaultAsync();

						//add image to db, root
						foreach (var file in productDTO.Files)
						{
							if (file != null && file.Length > 0)
							{
								string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
								using (var fileStream = new FileStream(Path.Combine(productPath, fileName), FileMode.Create))
								{
									file.CopyTo(fileStream);
								}

								Image image = new Image();
								image.ImageUrl = @"\images\" + fileName;

								if (proId != null)
								{
									image.ProductId = proId.Id;
									_unitOfWork.Image.Add(image);
								}
								else
								{
									_res.IsSuccess = false;
									ModelState.AddModelError(nameof(UpdateProductDTO.Name), "Product does not exist.");
									_res.Errors = ModelState.ToDictionary(
												 kvp => kvp.Key,
												 kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
											 );
									return NotFound(_res);
								}
							}
						}
						_unitOfWork.Save();
					}
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
			var productDelete = await _unitOfWork.Product.Get(x => x.Id == id, true).FirstOrDefaultAsync();
			if (productDelete == null)
			{
				_res.IsSuccess = false;
				_res.StatusCode = HttpStatusCode.NotFound;
				return NotFound(_res);
			}

			_unitOfWork.Product.Remove(productDelete);
			_unitOfWork.Save();

			_res.StatusCode = HttpStatusCode.OK;
			return Ok(_res);
		}
	}
}
