using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ProblemReport.Data.Migrations
{
    /// <inheritdoc />
    public partial class ReportStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Reports",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.InsertData(
                table: "Reports",
                columns: new[] { "Id", "Date", "ImagePath", "ImageType", "Status", "SubSystem", "Text" },
                values: new object[,]
                {
                    { "12c2cfb1-b248-4bae-b2a9-9ec3070f6019", new DateTime(2025, 7, 19, 20, 47, 41, 218, DateTimeKind.Local).AddTicks(4903), "../Assets/UploadedImages/not_found.png", "png", "Open", 2, "Nem talható az oldal." },
                    { "4b4cb4f6-5dcf-441e-8dd0-ec0e3f6252fd", new DateTime(2025, 7, 17, 20, 47, 41, 218, DateTimeKind.Local).AddTicks(4916), "../Assets/UploadedImages/timeout.jpg", "jpg", "Open", 4, "Nem tölti be az oldalt." },
                    { "598cfd0f-99ed-4abd-b8ec-015864722c55", new DateTime(2025, 7, 18, 20, 47, 41, 218, DateTimeKind.Local).AddTicks(4909), "../Assets/UploadedImages/server_error.jpg", "jpg", "Open", 3, "A szerver hibát jelez" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Reports",
                keyColumn: "Id",
                keyValue: "12c2cfb1-b248-4bae-b2a9-9ec3070f6019");

            migrationBuilder.DeleteData(
                table: "Reports",
                keyColumn: "Id",
                keyValue: "4b4cb4f6-5dcf-441e-8dd0-ec0e3f6252fd");

            migrationBuilder.DeleteData(
                table: "Reports",
                keyColumn: "Id",
                keyValue: "598cfd0f-99ed-4abd-b8ec-015864722c55");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Reports");

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
    }
}
