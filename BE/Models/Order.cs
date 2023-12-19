﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HNshop.Models
{
	public class Order
	{
		[Key]
		[Required]
		public int Id { get; set; }
		[Required]
		public double Total { get; set; }
		public DateTime OrderDate { get; set; } = DateTime.Now;
		public DateTime ShippingDate { get; set; }

		public string? OrderStatus { get; set; }
		public string? PaymentStatus { get; set; }
		public string? TrackingNumber { get; set; }
		public string? Carrier { get; set; }

		public DateTime PaymentDate { get; set; }
		public DateTime PaymentDueDate { get; set; }

		public string? SessionId { get; set; }
		public string? PaymentIntentId { get; set; }

		[Required]
		public string Name { get; set; }
		[Required]
		public string PhoneNumber { get; set; }
		[Required]
		public string StreetAddress { get; set; }
		[Required]
		public string City { get; set; }
		[Required]
		public string PostalCode { get; set; }

		public ICollection<Item>? Items { get; set; }

		[Required]
		public string ApplicationUserId { get; set; }
		[ForeignKey("ApplicationUserId")]
		//[ValidateNever]
		public ApplicationUser ApplicationUser { get; set; }
	}
}
