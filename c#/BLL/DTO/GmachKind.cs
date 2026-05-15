using System;
using System.Collections.Generic;

namespace BLL.DTO;

public partial class GmachKindDTO
{
    public int GmachKindCode { get; set; }

    public string GmachTypes { get; set; } = null!;

    public string? Pic { get; set; }

}
