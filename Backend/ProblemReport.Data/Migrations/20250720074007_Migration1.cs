using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ProblemReport.Data.Migrations
{
    /// <inheritdoc />
    public partial class Migration1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Reports",
                keyColumn: "Id",
                keyValue: "94efa7a0-d0cf-4dd1-bb85-af3a6648fd15");

            migrationBuilder.DeleteData(
                table: "Reports",
                keyColumn: "Id",
                keyValue: "b1031662-b8b0-48ed-803b-8a281577e738");

            migrationBuilder.DeleteData(
                table: "Reports",
                keyColumn: "Id",
                keyValue: "db528715-c291-4727-861b-9c7c9c3b384f");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.InsertData(
                table: "Reports",
                columns: new[] { "Id", "Date", "ImagePath", "ImageType", "Status", "SubSystem", "Text" },
                values: new object[,]
                {
                    { "94efa7a0-d0cf-4dd1-bb85-af3a6648fd15", new DateTime(2025, 7, 17, 22, 39, 26, 977, DateTimeKind.Local).AddTicks(2532), "../Assets/UploadedImages/timeout.jpg", "jpg", "Open", 4, "Nem tölti be az oldalt." },
                    { "b1031662-b8b0-48ed-803b-8a281577e738", new DateTime(2025, 7, 19, 22, 39, 26, 977, DateTimeKind.Local).AddTicks(2520), "../Assets/UploadedImages/not_found.png", "png", "Open", 2, "Nem talható az oldal." },
                    { "db528715-c291-4727-861b-9c7c9c3b384f", new DateTime(2025, 7, 18, 22, 39, 26, 977, DateTimeKind.Local).AddTicks(2526), "../Assets/UploadedImages/server_error.jpg", "jpg", "Open", 3, "A szerver hibát jelez" }
                });
        }
    }
}
