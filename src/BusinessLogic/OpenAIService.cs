using Domain;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace BusinessLogic
{
    public class OpenAiService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;

        public OpenAiService(IConfiguration config)
        {
            _httpClient = new HttpClient();
            _config = config;
        }

        public async Task<string> GetExplanation(PalkTulemus salary)
        {
            var prompt = $"Kirjuta lühike hinnang, kuidas oleks Eestis elada netopalgaga {salary.NetoPalk} eurot.";

            var request = new
            {
                model = "gpt-3.5-turbo",
                messages = new[] { new { role = "user", content = prompt } },
                max_tokens = 100
            };

            var req = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions");
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _config["OpenAI:ApiKey"]);
            req.Content = new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json");

            try
            {
                var res = await _httpClient.SendAsync(req);
                var body = await res.Content.ReadAsStringAsync();

                if (!res.IsSuccessStatusCode)
                {
                    return "AI selgituse genereerimine ebaõnnestus!";
                }

                var json = JsonDocument.Parse(body);

                if (json.RootElement.TryGetProperty("choices", out var choices) && choices[0].TryGetProperty("message", out var message))
                {
                    var text = message.GetProperty("content").GetString();
                    return text ?? "Selgitus puudub.";
                }

                return "Selgitus puudub.";
            }
            catch (Exception ex)
            {
                return $"Ilmnes viga: {ex.Message}";
            }
        }
    }
}