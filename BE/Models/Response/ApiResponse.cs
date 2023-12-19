﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace HNshop.Models.Response
{
	public class ApiResponse<T> where T : new()
	{
		public ApiResponse()
		{
			Errors = new Dictionary<string, List<string>>();
			Result = new();
		}
		public HttpStatusCode StatusCode { get; set; }
		public bool IsSuccess { get; set; } = true;
		public string Messages { get; set; } = string.Empty;
		public Dictionary<string, List<string>> Errors { get; set; }
		public T Result { get; set; }

	}
}
