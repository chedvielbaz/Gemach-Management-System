using System;
using System.Collections.Generic;

namespace DAL.modals
{
    public partial class Product
    {
        public Product()
        {
            OrdersProducts = new HashSet<OrdersProduct>();
        }

        public int ProductCode { get; set; }
        public string ProductName { get; set; } = null!;
        public int ProductCount { get; set; }
        public int? GmachCode { get; set; }

        public virtual Gmach? GmachCodeNavigation { get; set; }
        public virtual ICollection<OrdersProduct> OrdersProducts { get; set; }
    }
}
