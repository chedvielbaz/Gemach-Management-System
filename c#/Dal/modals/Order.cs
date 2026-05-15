using System;
using System.Collections.Generic;

namespace DAL.modals
{
    public partial class Order
    {
        public Order()
        {
            OrdersProducts = new HashSet<OrdersProduct>();
        }

        public int OrdersCode { get; set; }
        public string? CustEmail { get; set; }
        public DateTime? DateTaken { get; set; }
        public DateTime? ReturnDate { get; set; }
        public int? OrderStatus { get; set; }

        public virtual Customer? CustEmailNavigation { get; set; }
        public virtual ICollection<OrdersProduct> OrdersProducts { get; set; }
    }
}
