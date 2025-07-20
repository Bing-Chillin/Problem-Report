using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using ProblemReport.Data.Migrations;

namespace ProblemReport.Data.Helper;

public class AppUser : IdentityUser
{
    [StringLength(200)]
    public required string FamilyName { get; set; } = string.Empty;

    [StringLength(200)]
    public required string GivenName { get; set; } = string.Empty;
}
