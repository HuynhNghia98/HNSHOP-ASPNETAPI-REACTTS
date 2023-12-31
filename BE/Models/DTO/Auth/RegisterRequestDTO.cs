﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HNshop.Models.DTO.Auth
{
	public class RegisterRequestDTO
	{
		public string Username { get; set; }
		public string Name { get; set; }
		public string PhoneNumber { get; set; }
		public string? StreetAddress { get; set; }
		public string? City { get; set; }
		public string? PostalCode { get; set; }
		public string Password { get; set; }
		public string ConfirmPassword { get; set; }
		public string Role { get; set; }
	}
}
