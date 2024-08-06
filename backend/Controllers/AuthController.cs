namespace backend.Controllers.AuthController;

using backend.Models.User;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Context;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

[Route("/api/auth")]
[ApiController]
[Authorize]
public class AuthController : ControllerBase
{
    private readonly ChatAppContext _context;
    private readonly IConfiguration _config;

    public AuthController(ChatAppContext context, IConfiguration config)
    {
        _config = config;
        _context = context;
    }

    [HttpGet]
    public string Test()
    {
        return "hei";
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult> Register(User user)
    {
        var u = await _context.Users.Where<User>(u => u.Username == user.Username).FirstOrDefaultAsync();
        if (u != null)
        {
            return BadRequest(new { error = $"username ${user.Username} is already used" });
        }
        var hashedPass = BCrypt.Net.BCrypt.HashPassword(user.Password);
        user.Password = hashedPass;

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = GenerateJwtToken(user);
        return Ok(new { token });
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult> Login(User user)
    {
        var userFromDb = await _context.Users.Where<User>(u => u.Username == user.Username).FirstOrDefaultAsync();
        if (userFromDb == null)
        {
            return NotFound($"{user.Username} not found");
        }
        var passwordsMatch = BCrypt.Net.BCrypt.Verify(user.Password, userFromDb.Password);
        if (passwordsMatch)
        {
            var token = GenerateJwtToken(user);
            return Ok(new { token });
        }
        return Unauthorized(new { error = "Incorrect password" });
    }

    private string GenerateJwtToken(User user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Secret"]!));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Username),
            new Claim("id", user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken
        (
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(30),
            signingCredentials: credentials
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
