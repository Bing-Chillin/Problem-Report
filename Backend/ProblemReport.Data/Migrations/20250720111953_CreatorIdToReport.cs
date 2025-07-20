using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ProblemReport.Data.Migrations
{
    /// <inheritdoc />
    public partial class CreatorIdToReport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Reports",
                keyColumn: "Id",
                keyValue: "7ef8d3a4-a3e7-4cb0-bc6e-020bda6b0b31");

            migrationBuilder.DeleteData(
                table: "Reports",
                keyColumn: "Id",
                keyValue: "97776f23-c921-4026-a963-60cf28c787de");

            migrationBuilder.DeleteData(
                table: "Reports",
                keyColumn: "Id",
                keyValue: "a3b5ee5e-591e-47c4-8885-68718bf0a47e");

            migrationBuilder.DeleteData(
                table: "Reports",
                keyColumn: "Id",
                keyValue: "c71de6d5-4afb-4f82-a456-d1565aa0b21d");

            migrationBuilder.AddColumn<string>(
                name: "CreatorId",
                table: "Reports",
                type: "TEXT",
                maxLength: 250,
                nullable: false,
                defaultValue: "");

            migrationBuilder.InsertData(
                table: "Reports",
                columns: new[] { "Id", "CreatorId", "Date", "ImagePath", "ImageType", "Status", "SubSystem", "Text" },
                values: new object[,]
                {
                    { "39cc39df-5a5d-4a46-b480-fa3309ed9e2a", "", new DateTime(2025, 7, 19, 13, 19, 52, 844, DateTimeKind.Local).AddTicks(4381), "../Assets/UploadedImages/server_error.jpg", "jpg", "Open", 3, "A szerver hibát jelez" },
                    { "527689e8-c578-4dbe-aa4e-4c056c894695", "", new DateTime(2025, 7, 20, 13, 19, 52, 844, DateTimeKind.Local).AddTicks(4374), "../Assets/UploadedImages/not_found.png", "png", "Open", 2, "Nem talható az oldal." },
                    { "687c8e15-d231-4b82-97ac-9bb43f53c15a", "", new DateTime(2025, 7, 17, 13, 19, 52, 844, DateTimeKind.Local).AddTicks(4397), "../Assets/UploadedImages/timeout.jpg", "jpg", "Open", 4, "Nem tölti be azdsdsds oldalt." },
                    { "ad48c0b0-dc1f-4e06-bd71-2b70fd4525c3", "", new DateTime(2025, 7, 18, 13, 19, 52, 844, DateTimeKind.Local).AddTicks(4391), "../Assets/UploadedImages/timeout.jpg", "jpg", "Open", 4, "Nem tölti be az oldalt." }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Reports",
                keyColumn: "Id",
                keyValue: "39cc39df-5a5d-4a46-b480-fa3309ed9e2a");

            migrationBuilder.DeleteData(
                table: "Reports",
                keyColumn: "Id",
                keyValue: "527689e8-c578-4dbe-aa4e-4c056c894695");

            migrationBuilder.DeleteData(
                table: "Reports",
                keyColumn: "Id",
                keyValue: "687c8e15-d231-4b82-97ac-9bb43f53c15a");

            migrationBuilder.DeleteData(
                table: "Reports",
                keyColumn: "Id",
                keyValue: "ad48c0b0-dc1f-4e06-bd71-2b70fd4525c3");

            migrationBuilder.DropColumn(
                name: "CreatorId",
                table: "Reports");

            migrationBuilder.InsertData(
                table: "Reports",
                columns: new[] { "Id", "Date", "ImagePath", "ImageType", "Status", "SubSystem", "Text" },
                values: new object[,]
                {
                    { "7ef8d3a4-a3e7-4cb0-bc6e-020bda6b0b31", new DateTime(2025, 7, 19, 13, 9, 25, 108, DateTimeKind.Local).AddTicks(6536), "../Assets/UploadedImages/server_error.jpg", "jpg", "Open", 3, "A szerver hibát jelez" },
                    { "97776f23-c921-4026-a963-60cf28c787de", new DateTime(2025, 7, 17, 13, 9, 25, 108, DateTimeKind.Local).AddTicks(6548), "../Assets/UploadedImages/timeout.jpg", "jpg", "Open", 4, "Nem tölti be azdsdsds oldalt." },
                    { "a3b5ee5e-591e-47c4-8885-68718bf0a47e", new DateTime(2025, 7, 18, 13, 9, 25, 108, DateTimeKind.Local).AddTicks(6543), "../Assets/UploadedImages/timeout.jpg", "jpg", "Open", 4, "Nem tölti be az oldalt." },
                    { "c71de6d5-4afb-4f82-a456-d1565aa0b21d", new DateTime(2025, 7, 20, 13, 9, 25, 108, DateTimeKind.Local).AddTicks(6529), "../Assets/UploadedImages/not_found.png", "png", "Open", 2, "Nem talható az oldal." }
                });
        }
    }
}
