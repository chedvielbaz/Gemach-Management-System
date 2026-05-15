using DAL.modals;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.interfaces
{
    public interface IproductDal
    {
        public List<Product> GetProductsByGmachCode(int gmachCode);
        public bool AddProducts(List<Product> newProductsList);
        public bool DeleteProductsByGmachCode(int gmachCode);

    }
}
