namespace backend.Controllers.ChatController;

using backend.Context;
using backend.Models.ChatRoom;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("/api/chat")]
[ApiController]
[Authorize]
public class ChatController : ControllerBase
{
    private readonly ChatAppContext _context;

    public ChatController(ChatAppContext context)
    {
        _context = context;
    }

    [HttpPost("create-chat")]
    public async Task<ActionResult<ChatRoom>> CreateChatRoom(ChatRoom chat)
    {
        var c = await _context.ChatRooms.Where<ChatRoom>(c => c.Name == chat.Name).FirstOrDefaultAsync();
        if (c != null)
        {
            return BadRequest(new { error = $"chatroom {chat.Name} already exists" });
        }

        _context.ChatRooms.Add(chat);
        await _context.SaveChangesAsync();
        return Ok(chat);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<ChatRoom>> GetChatRoom(int id)
    {
        var chatRoom = await _context.ChatRooms.FindAsync(id);
        if (chatRoom == null)
        {
            return NotFound();
        }
        return Ok(chatRoom);
    }
}
