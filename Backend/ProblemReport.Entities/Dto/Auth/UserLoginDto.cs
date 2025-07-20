using System;

namespace ProblemReport.Entities.Dto.Auth;

public class UserLoginDto
{
    public required string UserName { get; set; } = string.Empty;
    public required string Password { get; set; } = string.Empty;
}
