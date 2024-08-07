using Microsoft.AspNetCore.SignalR;
using backend.Models.User;
using backend.Models.ChatRoom;
using backend.Context;


namespace backend.Hubs;

public class ChatHub : Hub
{
    private readonly ChatAppContext _context;

    public ChatHub(ChatAppContext context)
    {
        _context = context;
    }

    public async Task JoinChat(User user, ChatRoom chat)
    {
        var chatRoom = await _context.ChatRooms.FindAsync(chat.Id);
        if (chatRoom == null)
        {
            await Clients.Caller.SendAsync("Error", "ChatRoom not found");
            return;
        }

        chatRoom.Users.Add(user);
        await _context.SaveChangesAsync();

        await Groups.AddToGroupAsync(Context.ConnectionId, chatRoom.Name);
        await Clients.Groups(chatRoom.Name).SendAsync("UserJoined", user.Username);
    }
}
