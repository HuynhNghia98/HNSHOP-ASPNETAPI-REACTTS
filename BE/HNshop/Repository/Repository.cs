using HNshop.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HNshop.DataAccess.Repository.IRepository;
using HNshop.DataAccess.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace HNshop.DataAccess.Repository
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected readonly ApplicationDbContext _db;
        public DbSet<T> dbSet;
        public Repository(ApplicationDbContext db)
        {
            _db = db;
            dbSet = _db.Set<T>();
        }
        public void Add(T entity)
        {
            dbSet.Add(entity);
        }

        public T Find(int id)
        {
            return dbSet.Find(id);
        }

		public IQueryable<T> Get(Expression<Func<T, bool>> filter,bool asNoTracking)
		{
			IQueryable<T> query;
			if (asNoTracking)
			{
				query = dbSet.Where(filter).AsNoTracking();
			}
			else
			{
				query = dbSet.Where(filter);
			}
			return query;
		}

        public IQueryable<T> GetAll()
        {
            return dbSet;
        }

        public void Remove(T entity)
        {
            dbSet.Remove(entity);
        }

        public void RemoveRange(IEnumerable<T> entities)
        {
            dbSet.RemoveRange(entities);
        }
    }
}
