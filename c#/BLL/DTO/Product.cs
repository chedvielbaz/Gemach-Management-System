using System;
using System.Collections.Generic;

namespace BLL.DTO;

public partial class ProductDTO
{
    public int ProductCode { get; set; }

    public string ProductName { get; set; } = null!;

    public int ProductCount { get; set; }

    public int? GmachCode { get; set; }


}
