using DAL.modals;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.interfaces
{
    public interface IcustomerDal
    {
        public Customer? GetCustomerByPassword(string email, int password);
        public Customer? GetCustomerByEmail(string email);
        public Customer AddCustomer(Customer customer);

    }
}
