using System;
using System.Collections.Generic;

namespace DAL.modals
{
    public partial class OrdersProduct
    {
        public int OrdersProductCode { get; set; }
        public int? OrderCode { get; set; }
        public int? ProductCode { get; set; }
        public string? Comments { get; set; }
        public int? CountP { get; set; }

        public virtual Order? OrderCodeNavigation { get; set; }
        public virtual Product? ProductCodeNavigation { get; set; }
    }
}
