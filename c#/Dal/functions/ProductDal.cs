using DAL.interfaces;
using DAL.modals;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.functions
{
    public class ProductDal : IproductDal
    {
        gmachContext gmachstore;
        public ProductDal(gmachContext db)
        {
            gmachstore = db;
        }
        public bool AddProducts(List<Product> newProductsList)
        {
            try
            {
                gmachstore.Products.AddRange(newProductsList);
                gmachstore.SaveChanges();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public List<Product> GetProductsByGmachCode(int gmachCode)
        {
            try
            {
                return gmachstore.Products.Where(p => p.GmachCode == gmachCode).ToList();
            }
            catch
            {
                throw;
            }
        }
        public bool DeleteProductsByGmachCode(int gmachCode)
        {
            try
            {
                List<Product> products = gmachstore.Products.Where(p => p.GmachCode == gmachCode).ToList();
                gmachstore.Products.RemoveRange(products);
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

