using BLL.DTO;
using BLL.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace projectC_.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GmachController : ControllerBase
    {
        IgmachBll _IgmachBll;
        IproductBll _IproductBll;
        public GmachController(IgmachBll IgmachBll, IproductBll IproductBll)
        {
            _IgmachBll = IgmachBll;
            _IproductBll = IproductBll;
        }
        // gel all kinds of gmaches
        [HttpGet("GetAllGmachKinds")]
        public ActionResult<List<GmachKindDTO>> GetAllGmachKinds()
        {
            return Ok(_IgmachBll.GetAllGmachKinds());
        }
        // get all gmach by kind
        [HttpGet("GetGmachesByKind/{gmachKindCode}")]
        public ActionResult<List<GmachDTO>> GetGmachesByKind(int gmachKindCode)
        {
            return Ok(_IgmachBll.GetGmachesByKind(gmachKindCode));
        }

        [HttpGet("SearchGmaches")]
        public ActionResult<List<GmachDTO>> SearchGmaches([FromQuery] string? q)
        {
            return Ok(_IgmachBll.SearchGmachesByName(q));
        }

        [HttpGet("GetMyGmaches")]
        public ActionResult<List<GmachDTO>> GetMyGmaches([FromQuery] string custEmail)
        {
            if (string.IsNullOrWhiteSpace(custEmail))
                return BadRequest(new List<GmachDTO>());
            return Ok(_IgmachBll.GetGmachesByCustEmail(custEmail.Trim()));
        }

        // delete gmach — רק אם custEmail תואם את בעל הגמ״ח (נשמר בהוספה)
        [HttpDelete("DeleteGmach/{id}")]
        public ActionResult<bool> DeleteGmach(int id, [FromQuery] string custEmail)
        {
            if (string.IsNullOrWhiteSpace(custEmail))
                return BadRequest(false);

            var ok = _IgmachBll.DeleteGmach(id, custEmail.Trim());
            if (!ok)
                return StatusCode(StatusCodes.Status403Forbidden, false);

            return Ok(true);
        }
        // add gmach
        [HttpPut("AddGmach")]
        public ActionResult AddGmach(GmachRequest request)
        {
            try
            {
                if (request?.Gmach == null)
                {
                    return BadRequest(new { message = "חסרים פרטי גמ״ח — ודאו שכל השדות נשלחים כמספרים ולא כטקסט (כמות מוצר, טלפון, קטגוריה)." });
                }

                var newGmach = request.Gmach;
                var lp = request.ListProduct ?? new List<ProductDTO>();

                int newGmachcode = _IgmachBll.AddGmach(newGmach);

                foreach (var product in lp)
                {
                    product.GmachCode = newGmachcode;
                }

                return Ok(_IproductBll.AddProducts(lp));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
        // update gmach — רק אם בעלים תואם custEmail בשרשור
        [HttpPost("UpdateGmach")]
        public ActionResult UpdateGmach([FromBody] GmachDTO gmach, [FromQuery] string custEmail)
        {
            try
            {
                if (gmach == null || string.IsNullOrWhiteSpace(custEmail))
                    return BadRequest(new { message = "חסרים פרטי גמ״ח או מזהה משתמש." });

                var ok = _IgmachBll.UpdateGmach(gmach, custEmail.Trim());
                if (!ok)
                    return StatusCode(StatusCodes.Status403Forbidden, new { message = "אין הרשאה לעדכן גמ״ח זה או שהרשומה לא נמצאה." });

                return Ok(true);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
