using DAL.interfaces;
using DAL.modals;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.functions
{
    public class CustomerDal : IcustomerDal
    {
        gmachContext gmachstore;
        public CustomerDal(gmachContext db)
        {
            gmachstore = db;
        }

        public Customer AddCustomer(Customer customer)
        {
            try
            {
                gmachstore.Customers.Add(customer);
                gmachstore.SaveChanges();
                return customer;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public Customer? GetCustomerByPassword(string email, int password)
        {
            return gmachstore.Customers.FirstOrDefault(c => c.CustEmail == email && c.CustPasswword == password);
        }

        public Customer? GetCustomerByEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email)) return null;
            var e = email.Trim();
            return gmachstore.Customers.FirstOrDefault(c => c.CustEmail == e);
        }
    }
}
