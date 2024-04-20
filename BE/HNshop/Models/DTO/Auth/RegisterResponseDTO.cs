using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HNshop.Models.DTO.Auth
{
	public class RegisterResponseDTO
	{
		public string Email { get; set; }
		public string Token { get; set; }
	}
}
