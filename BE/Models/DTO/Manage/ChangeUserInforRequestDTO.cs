﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HNshop.Models.DTO.User
{
	public class ChangeUserInforRequestDTO
	{
		[Required]
		public string? PhoneNumber { get; set; }
		[Required]
		public string? Name { get; set; }
		[Required]
		public string? StreetAddress { get; set; }
		[Required]
		public string? City { get; set; }
		[Required]
		public string? PostalCode { get; set; }
	}
}
