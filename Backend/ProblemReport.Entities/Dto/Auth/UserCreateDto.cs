using System;
using System.ComponentModel.DataAnnotations;

namespace ProblemReport.Entities.Dto.Auth;

public class UserCreateDto
{
    public required string FamilyName { get; set; } = string.Empty;
    public required string GivenName { get; set; } = string.Empty;
    public required string UserName { get; set; } = string.Empty;
    public required string Email { get; set; } = string.Empty;
    public required string Password { get; set; } = string.Empty;
}
