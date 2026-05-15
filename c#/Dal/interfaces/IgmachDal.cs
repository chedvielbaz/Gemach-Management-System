using DAL.modals;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.interfaces
{
    public interface IgmachDal
    {
        //  public List<GmachKind> GetGmachTypes();
        //   public Gmach GetGmachById(Gmach a);
        // public bool DeleteGmach(Gmach  b);
        //  public bool AddGmach(Gmach c);
        public List<GmachKind> GetAllGmachKinds();
        public List<Gmach> SearchGmachesByName(string? query);
        public List<Gmach> GetGmachesByKind(int gmachKindCode);
        public List<Gmach> GetGmachesByCustEmail(string custEmail);
        public int AddGmach(Gmach gmach);
        /// <summary>מוחק גמ״ח רק אם custEmail תואם את הבעלים הרשום במסד.</summary>
        public bool DeleteGmach(int gmachCode, string custEmail);
       
        /// <summary>עדכון רק אם actingCustEmail תואם את בעל הגמ״ח במסד.</summary>
        public bool UpdateGmach(Gmach gmach, string actingCustEmail);


    }
}
