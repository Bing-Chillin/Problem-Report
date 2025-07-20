using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ProblemReport.Entities.Dto.Auth;

namespace ProblemReport.Endpoint.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private UserManager<IdentityUser> userManager;
    private RoleManager<IdentityRole> roleManager;

    public AuthController(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        this.userManager = userManager;
        this.roleManager = roleManager;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(UserCreateDto dto)
    {
        var user = new IdentityUser
        {
            UserName = dto.UserName,
            Email = dto.Email,
            EmailConfirmed = true,
        };
        var result = await userManager.CreateAsync(user, dto.Password);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        int devCount = 1;
        if (userManager.Users.Count() == 1)
        {
            await roleManager.CreateAsync(new IdentityRole("Admin"));
            await userManager.AddToRoleAsync(user, "Admin");
        }
        else if (userManager.Users.Count() <= devCount + 1)
        {
            if (!await roleManager.RoleExistsAsync("Developer"))
            {
                await roleManager.CreateAsync(new IdentityRole("Developer"));
            }
            await roleManager.CreateAsync(new IdentityRole("Developer"));
            await userManager.AddToRoleAsync(user, "Developer");
        }

        return Ok();
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(UserLoginDto dto)
    {
        var user = await userManager.FindByNameAsync(dto.UserName);
        if (user != null)
        {
            var result = await userManager.CheckPasswordAsync(user, dto.Password);
            if (result)
            {
                var claim = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName!),
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
                };

                foreach (var role in await userManager.GetRolesAsync(user))
                {
                    claim.Add(new Claim(ClaimTypes.Role, role));
                }

                int accessTokenExpiryInMinutes = 24 * 60;
                var accessToken = GenerateAccessToken(claim, accessTokenExpiryInMinutes);

                return Ok(new LoginResultDto()
                {
                    Token = new JwtSecurityTokenHandler().WriteToken(accessToken),
                    Expiration = DateTime.Now.AddMinutes(accessTokenExpiryInMinutes),
                });
            }
            else
            {
                return BadRequest("Nem jó a jelszó");
            }
        }
        else
        {
            return BadRequest("Nincs ilyen user");
        }
    }

    private JwtSecurityToken GenerateAccessToken(IEnumerable<Claim>? claims, int expiryInMinutes)
    {
        var signinKey = new SymmetricSecurityKey(
                  Encoding.UTF8.GetBytes("NagyonhosszútitkosítókulcsNagyonhosszútitkosítókulcsNagyonhosszútitkosítókulcsNagyonhosszútitkosítókulcsNagyonhosszútitkosítókulcsNagyonhosszútitkosítókulcs"));

        return new JwtSecurityToken(
              issuer: "problemreport.com",
              audience: "problemreport.com",
              claims: claims?.ToArray(),
              expires: DateTime.Now.AddMinutes(expiryInMinutes),
              signingCredentials: new SigningCredentials(signinKey, SecurityAlgorithms.HmacSha256)
            );
    }
}
