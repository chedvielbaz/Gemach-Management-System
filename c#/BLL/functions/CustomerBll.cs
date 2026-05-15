using AutoMapper;
using BLL.DTO;
using BLL.Interfaces;
using DAL.functions;
using DAL.interfaces;
using DAL.modals;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.functions
{
    public class CustomerBll : IcustomerBll
    {
        IcustomerDal customerDal;
        readonly IMapper imapper;
        public CustomerBll(IcustomerDal idal, IMapper imapper)
        {
            customerDal = idal;
            this.imapper = imapper;
        }

        public CustomerDTO AddCustomer(CustomerDTO customer)
        {
            try
            {
                Customer cust = imapper.Map<CustomerDTO, Customer>(customer);
                cust = customerDal.AddCustomer(cust);
                customer = imapper.Map<Customer, CustomerDTO>(cust);
                return customer;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public CustomerDTO? GetCustomerByEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email)) return null;
            var cust = customerDal.GetCustomerByEmail(email.Trim());
            return cust == null ? null : imapper.Map<Customer, CustomerDTO>(cust);
        }

        public CustomerDTO GetCustomerByPassword(CustomerDTO customer)
        {
            try
            {
                CustomerDTO custDTO = new CustomerDTO();
                Customer? cust = customerDal.GetCustomerByPassword(customer.CustEmail, customer.CustPasswword);
                if (cust == null)
                    return custDTO;

                custDTO = imapper.Map<Customer, CustomerDTO>(cust);
                return custDTO;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
