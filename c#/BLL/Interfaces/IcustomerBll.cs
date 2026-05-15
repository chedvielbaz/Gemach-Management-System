using BLL.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IcustomerBll
    {
        public CustomerDTO GetCustomerByPassword(CustomerDTO customer);
        public CustomerDTO? GetCustomerByEmail(string email);
        public CustomerDTO AddCustomer(CustomerDTO customer);


    }
}
