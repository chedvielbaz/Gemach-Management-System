using BLL.DTO;
using BLL.functions;
using BLL.Interfaces;
using DAL.modals;
using Microsoft.AspNetCore.Mvc;

namespace projectC_.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : Controller
    {
        IproductBll _IproductBll;
        public ProductController(IproductBll IproductBll)
        {
            _IproductBll = IproductBll;
        }
        //מקבל את כל המוצרים לפי קוד גמח
        [HttpGet("GetProductsByGmachCode/{gmachCode}")]
        public ActionResult<List<ProductDTO>> GetProductsByGmachCode(int gmachCode)
        {
            return Ok(_IproductBll.GetProductsByGmachCode(gmachCode));
        }
        //הוספת רשימת מוצרים לגמח מסוים יש לשלוח רשימת מוצרים בעת הוספת גמח
        [HttpPut("AddProducts")]
        public ActionResult<List<ProductDTO>> AddProducts(List<ProductDTO> newProductsList)
        {
            return Ok(_IproductBll.AddProducts(newProductsList));
        }
        //מחיקת כל המוצרים ששיכים לגמח מסוים לפי קוד גמח
        //יש לבצע בעת מחיקת גמח
        [HttpDelete("DeleteProductsByGmachCode/{gmachCode}")]
        public ActionResult<bool> DeleteProductsByGmachCode(int gmachCode)
        {
            return Ok(_IproductBll.DeleteProductsByGmachCode(gmachCode));
        }
    }
}
