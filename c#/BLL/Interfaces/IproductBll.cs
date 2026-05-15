using BLL.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IproductBll
    {
        public List<ProductDTO> GetProductsByGmachCode(int gmachCode);
        public bool AddProducts(List<ProductDTO> newProductList);
        public bool DeleteProductsByGmachCode(int gmachCode);
    }
}
