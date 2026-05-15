using DAL.interfaces;
using DAL.modals;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.functions
{
    public class GmachDal : IgmachDal
    {
        gmachContext gmachstore;
        public GmachDal(gmachContext db)
        {
            gmachstore = db;
        }

        public int AddGmach(Gmach gmach)
        {
            try
            {
                gmachstore.Gmaches.Add(gmach);
                gmachstore.SaveChanges();
                return gmach.GmachCode;
            }
            catch
            {
                throw;
            }
        }

        public List<GmachKind> GetAllGmachKinds()
        {
            try
            {
                return gmachstore.GmachKinds.ToList();
            }
            catch
            {
                throw;
            }
        }
        public bool DeleteGmach(int gmachCode, string custEmail)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(custEmail))
                    return false;

                var email = custEmail.Trim();
                Gmach? gmach = gmachstore.Gmaches.FirstOrDefault(g => g.GmachCode == gmachCode);
                if (gmach == null)
                    return false;

                var owner = gmach.CustEmail?.Trim();
                if (string.IsNullOrEmpty(owner) ||
                    !owner.Equals(email, StringComparison.OrdinalIgnoreCase))
                    return false;

                var products = gmachstore.Products.Where(p => p.GmachCode == gmachCode).ToList();
                gmachstore.Products.RemoveRange(products);
                gmachstore.Gmaches.Remove(gmach);
                gmachstore.SaveChanges();
                return true;
            }
            catch
            {
                return false;
            }

        }
        public List<Gmach> GetGmachesByKind(int gmachKindCode)
        {
            try
            {
                return gmachstore.Gmaches.Where(g => g.GmachKindCode == gmachKindCode).ToList();
            }
            catch
            {
                throw;
            }
        }

        public List<Gmach> GetGmachesByCustEmail(string custEmail)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(custEmail))
                    return new List<Gmach>();
                var emailNorm = custEmail.Trim().ToLowerInvariant();
                return gmachstore.Gmaches
                    .Where(g =>
                        g.CustEmail != null &&
                        g.CustEmail.Trim().ToLower() == emailNorm)
                    .OrderBy(g => g.GmachName)
                    .ToList();
            }
            catch
            {
                throw;
            }
        }

        public List<Gmach> SearchGmachesByName(string? query)
        {
            try
            {
                var q = gmachstore.Gmaches.AsQueryable();
                if (!string.IsNullOrWhiteSpace(query))
                {
                    var term = query.Trim();
                    q = q.Where(g => g.GmachName != null && g.GmachName.Contains(term));
                }
                else
                {
                    return new List<Gmach>();
                }

                return q.OrderBy(g => g.GmachName).ToList();
            }
            catch
            {
                throw;
            }
        }
        public bool UpdateGmach(Gmach gmach, string actingCustEmail)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(actingCustEmail))
                    return false;

                var actor = actingCustEmail.Trim();
                Gmach? gmachDB = gmachstore.Gmaches.FirstOrDefault(g => g.GmachCode == gmach.GmachCode);
                if (gmachDB == null)
                    return false;

                var owner = gmachDB.CustEmail?.Trim();
                if (string.IsNullOrEmpty(owner) ||
                    !owner.Equals(actor, StringComparison.OrdinalIgnoreCase))
                    return false;

                gmachDB.GmachName = gmach.GmachName;
                gmachDB.GmachAddrres = gmach.GmachAddrres;
                gmachDB.GmachPikadon = gmach.GmachPikadon;
                gmachDB.GmachTimes = gmach.GmachTimes;
                gmachDB.GmachPhone = gmach.GmachPhone;
                gmachDB.GmachKindCode = gmach.GmachKindCode;
                gmachDB.Comments = gmach.Comments;
                gmachDB.NumDays = gmach.NumDays;

                gmachstore.SaveChanges();
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
//     //   public bool AddGmach(Gmach c)
//       // {
//         //   gmachstore.Gmaches.Add(c);
//        //    gmachstore.SaveChanges();
//         //   return true;
//      ///  }

//     //   public bool DeleteGmach(Gmach b)
//       // {
//            //מחיקת גמח
//          //  Gmach h= gmachstore.Gmaches.FirstOrDefault(x=> x.GmachCode == b.GmachCode); 
//          //  if (h != null)
//          //  {
//             //   gmachstore.Gmaches.Remove(h);
//             //   gmachstore.SaveChanges();   
//           //     return true;
//         //   }
//            //    return false;
//      //  }

//      //  public Gmach GetGmachById(Gmach a)
//       // {
//           //בלחיצה על כפתור נתונים נוספים על גמח מסוים הוא מביא את רשימת המוצרים בגמח זה.
//       //    return 
//     //   }

//      //  public List<Gmach> GetGmaches()
//        //{
//            //בלחיצה על כפתור סוג גמח פותח את כל הגמחים של סוג גמח זה ומביא עליהם  נתונים 
//         //   return gmachstore.Gmach.ToList();
//       // }

//       // public List<Gmach> GetGmaches(Gmach d)
//       // {
//         //   throw new NotImplementedException();
//      //  }

//       // public List<GmachKind> GetGmachTypes()
//       // {
//            //מחזיר את רשימת סוגי הגמחים לדף קטגורית גמחים
//        //    return gmachstore.GmachKinds.ToList();
//      //  }
//  //  }
////}
