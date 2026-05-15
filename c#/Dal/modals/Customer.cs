using System;
using System.Collections.Generic;

namespace DAL.modals
{
    public partial class Customer
    {
        public Customer()
        {
            Orders = new HashSet<Order>();
        }

        public string CustEmail { get; set; } = null!;
        public string CustName { get; set; } = null!;
        public int? CustPhone { get; set; }
        public int CustPasswword { get; set; }

        public virtual ICollection<Order> Orders { get; set; }
    }
}
