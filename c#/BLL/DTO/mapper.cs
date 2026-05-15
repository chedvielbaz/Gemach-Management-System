using AutoMapper;
using DAL.modals;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.DTO
{
    public class mapper : Profile
    {
        public mapper()
        {
            CreateMap<Gmach, GmachDTO>();
            CreateMap<GmachDTO, Gmach>();
            CreateMap<GmachKind, GmachKindDTO>();
            CreateMap<GmachKindDTO, GmachKind>();
            CreateMap<Customer, CustomerDTO>();
            CreateMap<CustomerDTO, Customer>();
            CreateMap<Product, ProductDTO>();
            CreateMap<ProductDTO, Product>();
        }
    }
}
