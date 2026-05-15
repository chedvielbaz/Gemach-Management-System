using System;
using System.Collections.Generic;

namespace BLL.DTO;

public partial class OrderDTO
{
    public int OrdersCode { get; set; }

    public string? CustEmail { get; set; }

    public DateTime? DateTaken { get; set; }

    public DateTime? ReturnDate { get; set; }

    public int? OrderStatus { get; set; }


}
