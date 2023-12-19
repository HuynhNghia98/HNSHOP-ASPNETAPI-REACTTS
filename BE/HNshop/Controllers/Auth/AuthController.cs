using HNshop.DataAccess.Data;
using HNshop.DataAccess.Repository.IRepository;
using HNshop.Models;
using HNshop.Models.DTO.Auth;
using HNshop.Models.Response;
using HNshop.Utility;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;

namespace HNshop.Controllers.Auth
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ApplicationDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        public ApiResponse<object> _res;
        private string SecretKey;

        public AuthController(IUnitOfWork unitOfWork,
            ApplicationDbContext db,
            RoleManager<IdentityRole> roleManager,
            UserManager<ApplicationUser> userManager,
            IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _db = db;
            _roleManager = roleManager;
            _userManager = userManager;
            _res = new();
            SecretKey = configuration.GetValue<string>("ApiSettings:SecretKey");
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromForm] LoginRequestDTO loginRequestDTO)
        {
            ApplicationUser user = _db.Users.FirstOrDefault(x => x.UserName.ToLower() == loginRequestDTO.Username.ToLower());

            if (user == null)
            {
                _res.IsSuccess = false;
                _res.StatusCode = HttpStatusCode.NotFound;
                ModelState.AddModelError(nameof(LoginRequestDTO.Username), "Email not exists.");
                _res.Errors = ModelState.ToDictionary(
                             kvp => kvp.Key,
                             kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
                         );
                return NotFound(_res);
            }

            var isValid = await _userManager.CheckPasswordAsync(user, loginRequestDTO.Password);

            if (isValid == false)
            {
                _res.IsSuccess = false;
                _res.StatusCode = HttpStatusCode.BadRequest;
                ModelState.AddModelError(nameof(LoginRequestDTO.Password), "Wrong password.");
                _res.Errors = ModelState.ToDictionary(
                             kvp => kvp.Key,
                             kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
                         );
                _res.Result = new LoginRequestDTO();
                return BadRequest(_res);
            }

            //generate JWT Token
            LoginResponseDTO responseDTO = new()
            {
                Email = user.Email,
                Token = await GenerateToken(user),
            };

            if (responseDTO.Email == null || string.IsNullOrEmpty(responseDTO.Token))
            {
                _res.IsSuccess = false;
                _res.StatusCode = HttpStatusCode.BadRequest;
                ModelState.AddModelError(nameof(LoginRequestDTO.Username), "Cannot login.");
                _res.Errors = ModelState.ToDictionary(
                             kvp => kvp.Key,
                             kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
                         );
                _res.Result = new LoginRequestDTO();
                return BadRequest(_res);
            }

            _res.StatusCode = HttpStatusCode.OK;
            _res.Result = responseDTO;
            return Ok(_res);
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromForm] RegisterRequestDTO registerRequestDTO)
        {
            ApplicationUser user = _db.ApplicationUsers.FirstOrDefault(x => x.UserName.ToLower() == registerRequestDTO.Username.ToLower());

            if (user != null)
            {
                _res.IsSuccess = false;
                _res.StatusCode = HttpStatusCode.BadRequest;
                ModelState.AddModelError(nameof(LoginRequestDTO.Username), "Email already exists.");
                _res.Errors = ModelState.ToDictionary(
                             kvp => kvp.Key,
                             kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
                         );
                return BadRequest(_res);
            }
            else
            {
                //confirm password
                if(registerRequestDTO.ConfirmPassword != registerRequestDTO.Password)
                {
					_res.IsSuccess = false;
					_res.StatusCode = HttpStatusCode.BadRequest;
					ModelState.AddModelError(nameof(RegisterRequestDTO.ConfirmPassword), "Confirm password does not match the password.");
					_res.Errors = ModelState.ToDictionary(
								 kvp => kvp.Key,
								 kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
							 );
					return BadRequest(_res);
				}

                ApplicationUser newUser = new()
                {
                    UserName = registerRequestDTO.Username,
                    Email = registerRequestDTO.Username,
                    NormalizedEmail = registerRequestDTO.Username.ToLower(),
                    Name = registerRequestDTO.Name,
                    PhoneNumber = registerRequestDTO.PhoneNumber,
                    StreetAddress = registerRequestDTO.StreetAddress,
                    City = registerRequestDTO.City,
                    PostalCode = registerRequestDTO.PostalCode,
                };

                var result = await _userManager.CreateAsync(newUser, registerRequestDTO.Password);
                if (result.Succeeded)
                {
                    if (!_roleManager.RoleExistsAsync(SD.Role_Admin).GetAwaiter().GetResult() &&
                        !_roleManager.RoleExistsAsync(SD.Role_Customer).GetAwaiter().GetResult())
                    {
                        await _roleManager.CreateAsync(new IdentityRole(SD.Role_Admin));
                        await _roleManager.CreateAsync(new IdentityRole(SD.Role_Customer));
                    }
                    if (registerRequestDTO.Role == SD.Role_Admin)
                    {
                        await _userManager.AddToRoleAsync(newUser, SD.Role_Admin);
                    }
                    else
                    {
                        await _userManager.AddToRoleAsync(newUser, SD.Role_Customer);
                    }

                    ApplicationUser userCreated = _db.ApplicationUsers.FirstOrDefault(x => x.UserName.ToLower() == newUser.UserName.ToLower());

					//generate JWT Token
					RegisterResponseDTO responseDTO = new()
					{
						Email = userCreated.Email,
						Token = await GenerateToken(userCreated),
					};
                    _res.Result = responseDTO;
					_res.StatusCode = HttpStatusCode.OK;
                    return Ok(_res);
                }
                _res.IsSuccess = false;
                _res.StatusCode = HttpStatusCode.BadRequest;
                ModelState.AddModelError(nameof(RegisterRequestDTO.Username), "Cannot create account.");
                _res.Errors = ModelState.ToDictionary(
                             kvp => kvp.Key,
                             kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
                         );
                return BadRequest(_res);
            }
        }

        private async Task<string> GenerateToken(ApplicationUser user)
        {
			//generate JWT Token
			var roles = await _userManager.GetRolesAsync(user);
			JwtSecurityTokenHandler tokenHandler = new();
			byte[] key = Encoding.ASCII.GetBytes(SecretKey);

			SecurityTokenDescriptor tokenDescriptor = new()
			{
				Subject = new ClaimsIdentity(new Claim[]
				{
					new Claim("fullName",user.Name),
					new Claim("id",user.Id.ToString()),
					new Claim(ClaimTypes.Email,user.UserName),
					new Claim(ClaimTypes.Role,roles.FirstOrDefault()),
				}),
				Expires = DateTime.UtcNow.AddDays(7),
				SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
			};

			SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token).ToString();
		}

    }
}
