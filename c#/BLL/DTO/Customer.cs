using System;
using System.Collections.Generic;

namespace BLL.DTO;

public partial class CustomerDTO
{
    public string CustEmail { get; set; } = null!;

    public string CustName { get; set; } = null!;

    public int? CustPhone { get; set; }

    public int CustPasswword { get; set; }

}
