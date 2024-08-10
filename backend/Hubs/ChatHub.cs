using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
// using backend.Models.User;
using backend.Models.ChatRoom;
using backend.Context;
using System.Security.Claims;
using backend.Models.User;


namespace backend.Hubs;

public class ChatHub : Hub
{
    private readonly ChatAppContext _context;

    public ChatHub(ChatAppContext context)
    {
        _context = context;
    }

    public async Task JoinChat(int chatRoomId)
    {
        var username = Context.User?.FindFirst(ClaimTypes.Name)?.Value;
        var userId = Context.User?.FindFirst("id")?.Value;

        if (username == null || userId == null)
        {
            Console.WriteLine("how tf is this null");
            return;
        }
        Console.WriteLine($"id is {userId} and name is {username}");
        var chatRoom = await _context.ChatRooms.FindAsync(chatRoomId);
        if (chatRoom == null)
        {
            Console.WriteLine("chatroom is null somehow");
            await Clients.Caller.SendAsync("Error", "ChatRoom not found");
            return;
        }

        chatRoom.Users ??= new List<User>();
        var user = await _context.Users.FindAsync(int.Parse(userId));
        if (user != null && !chatRoom.Users.Any(u => u.Id == user.Id))
        {
            chatRoom.Users.Add(user);
            await _context.SaveChangesAsync();
        }
        await Groups.AddToGroupAsync(Context.ConnectionId, chatRoom.Name);
        await Clients.OthersInGroup(chatRoom.Name).SendAsync("UserJoined", username);
    }

    public async Task LeaveChat(int chatRoomId)
    {
        var username = Context.User?.FindFirst(ClaimTypes.Name)?.Value;
        var chatRoom = await _context.ChatRooms.FindAsync(chatRoomId);
        if (chatRoom == null)
        {
            Console.WriteLine("chatroom is null");
            return;
        }
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, chatRoom.Name);
        await Clients.Groups(chatRoom.Name).SendAsync("UserLeft", username);
    }
}
