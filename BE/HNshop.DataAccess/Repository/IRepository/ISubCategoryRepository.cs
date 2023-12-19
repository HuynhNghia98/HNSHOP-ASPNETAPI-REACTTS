﻿using HNshop.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HNshop.DataAccess.Repository.IRepository
{
	public interface ISubCategoryRepository:IRepository<SubCategory>
	{
		void Update(SubCategory SubCategory);
	}
}
