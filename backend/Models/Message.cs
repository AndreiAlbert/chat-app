namespace backend.Models.Message;
using backend.Models.User;
using backend.Models.ChatRoom;
using System.Text.Json.Serialization;

public class Message
{
    public int Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public int? UserId { get; set; }
    public User? User { get; set; }
    public int ChatRoomId { get; set; }
    [JsonIgnore]
    public ChatRoom? ChatRoom { get; set; }
}
