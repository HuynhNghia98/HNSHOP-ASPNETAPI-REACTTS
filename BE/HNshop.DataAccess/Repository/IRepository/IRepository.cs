﻿using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace HNshop.DataAccess.Repository.IRepository
{
    public interface IRepository<T> where T : class
    {
        //IEnumerable<T> GetAll();
        T Find(int id);
        IQueryable<T> GetAll();
		IQueryable<T> Get(Expression<Func<T, bool>> filter, bool asNoTracking);
        void Add(T entity);
        void Remove(T entity);
        void RemoveRange(IEnumerable<T> entities);
    }
}
