using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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
}
