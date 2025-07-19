using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ProblemReport.Entities.Helper;

namespace ProblemReport.Entities.Entity;

public enum SubSystem
{
    None = 0,
    Cemetery = 1,
    PlayGround = 2,
}

public class Report : IIdentity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public SubSystem SubSystem { get; set; } = SubSystem.None;
    [StringLength(250)]
    public string Text { get; set; } = string.Empty;
    public byte[]? ImageData { get; set; }
    public string ImageType { get; set; } = string.Empty;
    public DateTime Date { get; set; } = DateTime.Now;
}
