namespace backend.Context;

using Microsoft.EntityFrameworkCore;
using backend.Models.ChatRoom;
using backend.Models.Message;
using backend.Models.User;

public class ChatAppContext : DbContext
{
    public ChatAppContext(DbContextOptions<ChatAppContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<ChatRoom> ChatRooms { get; set; }
}

