using AutoMapper;
using BLL.DTO;
using BLL.Interfaces;
using DAL.modals;
using DAL.functions;
using DAL.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.functions
{
    public class GmachBLL : IgmachBll
    {
        IgmachDal GmachDal;
        readonly IMapper imapper;
        public GmachBLL(IgmachDal idal, IMapper imapper)
        {
            GmachDal = idal;
            this.imapper = imapper;
        }

        public int AddGmach(GmachDTO newGmach)
        {
            try
            {
                Gmach gmach = imapper.Map<GmachDTO, Gmach>(newGmach);
                return GmachDal.AddGmach(gmach);
            }
            catch (Exception err)
            {
                throw new Exception(err.Message);
            }
        }
        public List<GmachKindDTO> GetAllGmachKinds()
        {
            try
            {
                List<GmachKind> list = GmachDal.GetAllGmachKinds();
                return imapper.Map<List<GmachKind>, List<GmachKindDTO>>(list);
            }
            catch
            {
                throw;
            }
        }

        public List<GmachDTO> GetGmachesByKind(int gmachKindCode)
        {
            try
            {
                List<Gmach> list = GmachDal.GetGmachesByKind(gmachKindCode);
                return imapper.Map<List<Gmach>, List<GmachDTO>>(list);
            }
            catch
            {
                throw;
            }
        }

        public List<GmachDTO> GetGmachesByCustEmail(string custEmail)
        {
            try
            {
                List<Gmach> list = GmachDal.GetGmachesByCustEmail(custEmail);
                return imapper.Map<List<Gmach>, List<GmachDTO>>(list);
            }
            catch
            {
                throw;
            }
        }

        public List<GmachDTO> SearchGmachesByName(string? query)
        {
            try
            {
                List<Gmach> list = GmachDal.SearchGmachesByName(query);
                return imapper.Map<List<Gmach>, List<GmachDTO>>(list);
            }
            catch
            {
                throw;
            }
        }

        public bool DeleteGmach(int gmachCode, string custEmail)
        {
            return GmachDal.DeleteGmach(gmachCode, custEmail);
        }
        public bool UpdateGmach(GmachDTO gmachDTO, string custEmail)
        {
            try
            {
                Gmach g = imapper.Map<GmachDTO, Gmach>(gmachDTO);
                return GmachDal.UpdateGmach(g, custEmail);
            }
            catch (Exception err)
            {
                throw new Exception(err.Message);
            }
        }

        //public bool Add(GmachDTO newgmach)
        //{
        //    בדיקה האם קיים כזה גמח
        //   ???
        //   Gmach gmach = GmachDal.GetGmachById(newgmach.GmachCode);
        //    if (Gmach == null)
        //    {
        //        הוספה
        //        return GmachDal.AddGmach(m.Map<GmachDTO, Gmach>(newgmach));
        //    }
        //    return false;

        //}



        //public bool Delete(GmachDTO b)
        //{
        //    return GmachDal.DeleteGmach(Gmach b);
        //}
    }
}
