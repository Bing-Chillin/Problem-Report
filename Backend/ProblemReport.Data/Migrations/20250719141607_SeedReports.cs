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
            migrationBuilder.DropColumn(
                name: "ImageData",
                table: "Reports");

            migrationBuilder.AlterColumn<string>(
                name: "ImageType",
                table: "Reports",
                type: "nvarchar(250)",
                maxLength: 250,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "ImagePath",
                table: "Reports",
                type: "nvarchar(250)",
                maxLength: 250,
                nullable: true);

            migrationBuilder.InsertData(
                table: "Reports",
                columns: new[] { "Id", "Date", "ImagePath", "ImageType", "SubSystem", "Text" },
                values: new object[,]
                {
                    { "0242b3bb-ed95-4c34-a2b8-5cfe9cc20ffe", new DateTime(2025, 7, 19, 16, 16, 6, 844, DateTimeKind.Local).AddTicks(466), "../Assets/UploadedImages/not_found.png", "png", 2, "Nem talható az oldal." },
                    { "2badc1fd-4ea7-42b2-bd14-9a8594641f65", new DateTime(2025, 7, 18, 16, 16, 6, 844, DateTimeKind.Local).AddTicks(473), "../Assets/UploadedImages/server_error.jpg", "jpg", 3, "A szerver hibát jelez" },
                    { "342219dd-992f-41f0-acfc-088936a7059f", new DateTime(2025, 7, 17, 16, 16, 6, 844, DateTimeKind.Local).AddTicks(492), "../Assets/UploadedImages/timeout.jpg", "jpg", 4, "Nem tölti be az oldalt." }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Reports",
                keyColumn: "Id",
                keyValue: "0242b3bb-ed95-4c34-a2b8-5cfe9cc20ffe");

            migrationBuilder.DeleteData(
                table: "Reports",
                keyColumn: "Id",
                keyValue: "2badc1fd-4ea7-42b2-bd14-9a8594641f65");

            migrationBuilder.DeleteData(
                table: "Reports",
                keyColumn: "Id",
                keyValue: "342219dd-992f-41f0-acfc-088936a7059f");

            migrationBuilder.DropColumn(
                name: "ImagePath",
                table: "Reports");

            migrationBuilder.AlterColumn<string>(
                name: "ImageType",
                table: "Reports",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(250)",
                oldMaxLength: 250,
                oldNullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "ImageData",
                table: "Reports",
                type: "varbinary(max)",
                nullable: true);
        }
    }
}
