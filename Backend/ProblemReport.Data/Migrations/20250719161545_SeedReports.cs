using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ProblemReport.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedReports : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Reports",
                columns: new[] { "Id", "Date", "ImagePath", "ImageType", "SubSystem", "Text" },
                values: new object[,]
                {
                    { "085f9ae6-f643-4df1-9338-4270b8960de1", new DateTime(2025, 7, 18, 18, 15, 45, 63, DateTimeKind.Local).AddTicks(994), "../Assets/UploadedImages/server_error.jpg", "jpg", 3, "A szerver hibát jelez" },
                    { "4e1bfd16-cb16-4c62-856d-2260e66a057a", new DateTime(2025, 7, 19, 18, 15, 45, 63, DateTimeKind.Local).AddTicks(980), "../Assets/UploadedImages/not_found.png", "png", 2, "Nem talható az oldal." },
                    { "ebf80d29-7870-4ecc-a46f-75219927dfaa", new DateTime(2025, 7, 17, 18, 15, 45, 63, DateTimeKind.Local).AddTicks(1001), "../Assets/UploadedImages/timeout.jpg", "jpg", 4, "Nem tölti be az oldalt." }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Reports",
                keyColumn: "Id",
                keyValue: "085f9ae6-f643-4df1-9338-4270b8960de1");

            migrationBuilder.DeleteData(
                table: "Reports",
                keyColumn: "Id",
                keyValue: "4e1bfd16-cb16-4c62-856d-2260e66a057a");

            migrationBuilder.DeleteData(
                table: "Reports",
                keyColumn: "Id",
                keyValue: "ebf80d29-7870-4ecc-a46f-75219927dfaa");
        }
    }
}
