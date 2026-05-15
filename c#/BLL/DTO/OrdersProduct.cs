using System;
using System.Collections.Generic;

namespace BLL.DTO;

public partial class OrdersProductDTO
{
    public int OrdersProductCode { get; set; }

    public int? OrderCode { get; set; }

    public int? ProductCode { get; set; }

    public string? Comments { get; set; }

    public int? CountP { get; set; }


}
