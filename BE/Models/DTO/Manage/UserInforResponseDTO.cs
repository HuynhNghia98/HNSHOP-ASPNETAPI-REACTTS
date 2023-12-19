using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HNshop.Models.DTO.User
{
	public class UserInforResponseDTO
	{
		public string? UserName { get; set; }
		public string? PhoneNumber { get; set; }
		public string? Name { get; set; }
		public string? StreetAddress { get; set; }
		public string? City { get; set; }
		public string? PostalCode { get; set; }
	}
}
