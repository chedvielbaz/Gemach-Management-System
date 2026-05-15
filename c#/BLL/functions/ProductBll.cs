using AutoMapper;
using BLL.DTO;
using BLL.Interfaces;
using DAL.interfaces;
using DAL.modals;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.functions
{
    public class ProductBll : IproductBll
    {
        IproductDal ProductDal;
        readonly IMapper imapper;
        public ProductBll(IproductDal IproductDal, IMapper imapper)
        {
            ProductDal = IproductDal;
            this.imapper = imapper;
        }
        public bool AddProducts(List<ProductDTO> newProductList)
        {
            try
            {
                List<Product> products = imapper.Map<List<ProductDTO>, List<Product>>(newProductList);
                return ProductDal.AddProducts(products);
            }
            catch (Exception err)
            {
                throw new Exception(err.Message);
            }
        }

        public List<ProductDTO> GetProductsByGmachCode(int gmachCode)
        {
            try
            {
                List<Product> list = ProductDal.GetProductsByGmachCode(gmachCode);
                return imapper.Map<List<Product>, List<ProductDTO>>(list);

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
                return ProductDal.DeleteProductsByGmachCode(gmachCode);
            }
            catch (Exception err)
            {
                throw new Exception(err.Message);
            }
        }
    }
}

