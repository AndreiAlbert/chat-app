namespace backend.Models.ChatRoom;
using backend.Models.Message;

public class ChatRoom
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public ICollection<Message> Messages { get; set; }
}
