using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ProblemReport.Data.Migrations
{
    /// <inheritdoc />
    public partial class FullName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Reports",
                keyColumn: "Id",
                keyValue: "31425bfd-e908-49cf-8f9a-cbe7ca6b1e99");

            migrationBuilder.DeleteData(
                table: "Reports",
                keyColumn: "Id",
                keyValue: "60288daa-b030-4af0-b6b3-5d1d976381ac");

            migrationBuilder.DeleteData(
                table: "Reports",
                keyColumn: "Id",
                keyValue: "91e92c76-e410-4ee4-9114-00a8a51d4207");

            migrationBuilder.DeleteData(
                table: "Reports",
                keyColumn: "Id",
                keyValue: "da3b1eee-c7f6-49ad-b551-ebd5ebe46779");

            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "AspNetUsers",
                type: "TEXT",
                maxLength: 13,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FamilyName",
                table: "AspNetUsers",
                type: "TEXT",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GivenName",
                table: "AspNetUsers",
                type: "TEXT",
                maxLength: 200,
                nullable: true);

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "FamilyName",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "GivenName",
                table: "AspNetUsers");

            migrationBuilder.InsertData(
                table: "Reports",
                columns: new[] { "Id", "Date", "ImagePath", "ImageType", "Status", "SubSystem", "Text" },
                values: new object[,]
                {
                    { "31425bfd-e908-49cf-8f9a-cbe7ca6b1e99", new DateTime(2025, 7, 20, 9, 40, 7, 569, DateTimeKind.Local).AddTicks(8572), "../Assets/UploadedImages/not_found.png", "png", "Open", 2, "Nem talható az oldal." },
                    { "60288daa-b030-4af0-b6b3-5d1d976381ac", new DateTime(2025, 7, 18, 9, 40, 7, 569, DateTimeKind.Local).AddTicks(8597), "../Assets/UploadedImages/timeout.jpg", "jpg", "Open", 4, "Nem tölti be az oldalt." },
                    { "91e92c76-e410-4ee4-9114-00a8a51d4207", new DateTime(2025, 7, 17, 9, 40, 7, 569, DateTimeKind.Local).AddTicks(8606), "../Assets/UploadedImages/timeout.jpg", "jpg", "Open", 4, "Nem tölti be azdsdsds oldalt." },
                    { "da3b1eee-c7f6-49ad-b551-ebd5ebe46779", new DateTime(2025, 7, 19, 9, 40, 7, 569, DateTimeKind.Local).AddTicks(8585), "../Assets/UploadedImages/server_error.jpg", "jpg", "Open", 3, "A szerver hibát jelez" }
                });
        }
    }
}
