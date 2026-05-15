using BLL.DTO;
using BLL.functions;
using BLL.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace projectC_.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        IcustomerBll _IcustomerBll;
        public CustomerController(IcustomerBll IcustomerBll)
        {
            _IcustomerBll = IcustomerBll;
        }
        //עם משתנים שם שיהיה ריק ומייל וסיסמא cutomer צריך לקבל אוביקט של  
        
        [HttpPost("GetCustomerByPassword")]
        public ActionResult GetCustomerByPassword(CustomerDTO customer)
        {
            return Ok(_IcustomerBll.GetCustomerByPassword(customer));
        }
        [HttpPut("AddCustomer")]
        public ActionResult AddCustomer(CustomerDTO? customer)
        {
            if (customer == null || string.IsNullOrWhiteSpace(customer.CustEmail))
                return BadRequest(new { message = "חסרים פרטי משתמש או מייל." });

            customer.CustEmail = customer.CustEmail.Trim();

            var existing = _IcustomerBll.GetCustomerByEmail(customer.CustEmail);
            if (existing != null && !string.IsNullOrWhiteSpace(existing.CustEmail))
            {
                return Conflict(new
                {
                    message = "המייל כבר רשום במערכת. השתמשו בכניסה (התחברות) במקום הרשמה חוזרת."
                });
            }

            return Ok(_IcustomerBll.AddCustomer(customer));
        }
    }
}
