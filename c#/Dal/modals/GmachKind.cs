using System;
using System.Collections.Generic;

namespace DAL.modals
{
    public partial class GmachKind
    {
        public GmachKind()
        {
            Gmaches = new HashSet<Gmach>();
        }

        public int GmachKindCode { get; set; }
        public string GmachTypes { get; set; } = null!;
        public string? Pic { get; set; }

        public virtual ICollection<Gmach> Gmaches { get; set; }
    }
}
