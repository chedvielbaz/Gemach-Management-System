using System;
using System.Collections.Generic;

namespace DAL.modals
{
    public partial class Gmach
    {
        public Gmach()
        {
            Products = new HashSet<Product>();
        }

        public int GmachCode { get; set; }
        public string GmachName { get; set; } = null!;
        public string GmachAddrres { get; set; } = null!;
        public bool? GmachPikadon { get; set; }
        public string GmachTimes { get; set; } = null!;
        public int? GmachPhone { get; set; }
        public int? GmachKindCode { get; set; }
        public string? Comments { get; set; }
        public int? NumDays { get; set; }

        /// <summary>מייל המשתמש שהוסיף את הגמ״ח — לאימות מחיקה בלבד.</summary>
        public string? CustEmail { get; set; }

        public virtual GmachKind? GmachKindCodeNavigation { get; set; }
        public virtual ICollection<Product> Products { get; set; }
    }
}
