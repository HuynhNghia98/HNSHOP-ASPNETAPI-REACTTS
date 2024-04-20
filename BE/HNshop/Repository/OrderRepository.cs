using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using HNshop.DataAccess.Data;
using HNshop.DataAccess.Repository.IRepository;
using HNshop.Models;
using HNshop.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace HNshop.DataAccess.Repository
{
	public class OrderRepository : Repository<Order>, IOrderRepository
	{
		public OrderRepository(ApplicationDbContext db) : base(db)
		{
		}

		public void Update(Order order)
		{
			_db.Update(order);
		}

		public void UpdateStatus(int id, string orderStatus, string? paymentStatus = null)
		{
			var orderFromDb = _db.Orders.FirstOrDefault(x => x.Id == id);
			if (orderFromDb != null)
			{
				if (orderStatus == SD.Order_Completed)
				{
					orderFromDb.OrderStatus = orderStatus;
					orderFromDb.ShippingDate = DateTime.Now;
				}
				else
				{
					orderFromDb.OrderStatus = orderStatus;
				}

				if (!string.IsNullOrEmpty(paymentStatus))
				{
					orderFromDb.PaymentStatus = paymentStatus;
				}
			}
		}

		public void UpdateStripePaymentId(int id, string sessionId, string paymentIntentId)
		{
			var orderFromDb = _db.Orders.FirstOrDefault(x => x.Id == id);
			if (!string.IsNullOrEmpty(sessionId))
			{
				orderFromDb.SessionId = sessionId;
			}
			if (!string.IsNullOrEmpty(paymentIntentId))
			{
				orderFromDb.PaymentIntentId = paymentIntentId;
				orderFromDb.PaymentDate = DateTime.Now;
			}
		}

	}
}
