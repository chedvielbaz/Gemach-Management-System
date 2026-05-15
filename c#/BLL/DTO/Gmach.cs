using System;
using System.Collections.Generic;

namespace BLL.DTO;

public partial class GmachDTO
{
    public int GmachCode { get; set; }

    public string GmachName { get; set; } = null!;

    public string GmachAddrres { get; set; } = null!;

    public bool? GmachPikadon { get; set; }

    public string GmachTimes { get; set; } = null!;

    public int? GmachPhone { get; set; }

    public int? GmachKindCode { get; set; }

    public string? Comments { get; set; }

    public int? NumDays { get; set; }

    /// <summary>מייל הבעלים — נשמר בהוספה ומשמש לאימות מחיקה.</summary>
    public string? CustEmail { get; set; }

}
