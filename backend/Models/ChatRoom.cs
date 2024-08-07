namespace backend.Models.ChatRoom;

using System.Text.Json.Serialization;
using backend.Models.Message;
using backend.Models.User;

public class ChatRoom
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public ICollection<Message> Messages { get; set; }
    public ICollection<User> Users { get; set; }
}
