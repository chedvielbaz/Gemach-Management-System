using BLL.DTO;
using DAL.modals;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IgmachBll
    {
        public List<GmachKindDTO> GetAllGmachKinds();
        public List<GmachDTO> SearchGmachesByName(string? query);
        public List<GmachDTO> GetGmachesByKind(int gmachKindCode);
        public List<GmachDTO> GetGmachesByCustEmail(string custEmail);
        public int AddGmach(GmachDTO newGmach);
       
        public bool DeleteGmach(int gmachCode, string custEmail);
        bool UpdateGmach(GmachDTO gmach, string custEmail);

        // public bool Delete(GmachDTO b);
    }
}
