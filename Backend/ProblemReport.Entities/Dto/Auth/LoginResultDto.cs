using System;

namespace ProblemReport.Entities.Dto.Auth;

public class LoginResultDto
{
    public string Token { get; set; } = string.Empty;
    public DateTime Expiration { get; set; }
}
