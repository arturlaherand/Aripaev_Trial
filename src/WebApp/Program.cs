using BusinessLogic;
using Domain;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddScoped<PalkService>();
builder.Services.AddScoped<OpenAiService>();

var app = builder.Build();
app.UseCors("AllowReactApp");
app.UseSwagger();
app.UseSwaggerUI();

app.MapPost("/api/palk/arvuta", async (
    PalkSisend input,
    PalkService salaryService,
    OpenAiService openAiService) =>
{
    var result = salaryService.Calculate(input);
    result.OpenAiHinnang = await openAiService.GetExplanation(result);
    return Results.Ok(result);
});

app.Run();
