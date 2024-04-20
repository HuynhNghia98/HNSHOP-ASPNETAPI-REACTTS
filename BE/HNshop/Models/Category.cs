using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using HNshop.Utility;

namespace HNshop.Models
{
    public class Category
    {
        [Key]
		[Required]
		public int Id { get; set; }

		[Required]
		[MaxLength(100)]
        public string Name { get; set; }
		[Required]
		public string UrlName { get; set; }

		[MaxLength(500)]
		public string? Description { get; set; }
		public DateTime CreateTime { get; set; } = DateTime.Now;
		public DateTime UpdateTime { get; set; }
		public ICollection<SubCategory>? SubCategories { get; set; }
	}
}
