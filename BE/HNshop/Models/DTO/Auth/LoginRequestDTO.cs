using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HNshop.Models.DTO.Auth
{
	public class LoginRequestDTO
	{
		public string Username { get; set; }
		public string Password { get; set; }
	}
}
