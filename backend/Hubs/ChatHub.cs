using Microsoft.AspNetCore.SignalR;
using backend.Models;

namespace backend.Hubs;

public class ChatHub : Hub
{
    public async Task JoinChat(UserConnection conn)
    {
        await Clients.All
            .SendAsync("ReceivedMessage", "admin", $"{conn.Username} has joined");
    }

    public async Task JoinSpecificChatRoom(UserConnection conn)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, conn.ChatRoom);
        await Clients
            .Groups(conn.ChatRoom)
            .SendAsync("JoinSpecificChatroom", "admin", $"{conn.Username} has joined {conn.ChatRoom}");
    }
}
