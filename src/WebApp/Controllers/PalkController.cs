using BusinessLogic;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace WebApp.Controllers
{
    public class PalkController : ControllerBase
    {
        private readonly PalkService _salaryService;
        private readonly OpenAiService _openAiService;

        public PalkController(PalkService salaryService, OpenAiService openAiService)
        {
            _salaryService = salaryService;
            _openAiService = openAiService;
        }

        [HttpPost("arvuta")]
        public async Task<IActionResult> Arvuta([FromBody] PalkSisend input)
        {
            if (input == null)
                return BadRequest("Input is missing.");

            var result = _salaryService.Calculate(input);
            result.OpenAiHinnang = await _openAiService.GetExplanation(result);
            return Ok(result);
        }
    }
}
