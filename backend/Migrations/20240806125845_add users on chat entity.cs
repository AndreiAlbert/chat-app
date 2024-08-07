using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class addusersonchatentity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ChatRoomId",
                table: "Users",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_ChatRoomId",
                table: "Users",
                column: "ChatRoomId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_ChatRooms_ChatRoomId",
                table: "Users",
                column: "ChatRoomId",
                principalTable: "ChatRooms",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_ChatRooms_ChatRoomId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_ChatRoomId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ChatRoomId",
                table: "Users");
        }
    }
}
