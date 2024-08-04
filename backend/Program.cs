using backend.Hubs;
var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapHub<ChatHub>("/Chat");
app.UseAuthorization();

app.MapControllers();

app.Run();
