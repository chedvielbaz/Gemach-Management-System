using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.DTO
{
    public class GmachRequest
    {
        public GmachDTO? Gmach { get; set; }
        public List<ProductDTO>? ListProduct { get; set; }
    }
}

