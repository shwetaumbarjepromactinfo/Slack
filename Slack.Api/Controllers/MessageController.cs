using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Slack.Core;
using Slack.Data;

namespace Slack.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly SlackDbContext _context;

        public MessageController(SlackDbContext _context)
        {
            this._context = _context;
        }

        [HttpPost]
        public async Task<ActionResult<Message>> AddMessage(Message message)
        {
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetMessage), new { MessageId = message.MessageId }, message);
        }

        [HttpGet("{messageId}")]
        public async Task<ActionResult<Message>> GetMessage(int messageId)
        {
            var message = await _context.Messages.FindAsync(messageId);
            if (message == null)
            {
                return NotFound();
            }
            return message;
        }

        [HttpGet("{userId}/friend/{friendId}/workspace/{workspaceId}")]
        public async Task<IEnumerable<MessageDetails>> GetAllMessage(int userId, int friendId, int workspaceId)
        {
            var message = await (from m in _context.Messages
                                 join u in _context.Users on m.SentBy equals u.UserId
                                 join uf in _context.Users on m.ReceivedBy equals uf.UserId
                                 where (m.SentBy == userId && m.ReceivedBy == friendId && m.WorkspaceId == workspaceId) ||
                                       (m.SentBy == friendId && m.ReceivedBy == userId && m.WorkspaceId == workspaceId)
                                 select new MessageDetails
                                 {
                                     WorkspaceId = m.WorkspaceId,
                                     MessageId = m.MessageId,
                                     MessageDescription = m.MessageDescription,
                                     CreatedAt = m.CreatedAt,
                                     SendById = m.SentBy,
                                     SendByName = u.DisplayName,
                                     SendByImagePath = u.ImagePath,
                                     ReceivedBy = uf.UserId,
                                     ReceivedByName = uf.DisplayName,
                                     ReceivedByImagePath = uf.ImagePath,
                                 } 
                                 ).ToListAsync();
            return message;
        }

        [HttpPut("{MessageId}")]
        public async Task<IActionResult> UpdateMessage(int messageId, Message message)
        {
            if (messageId != message.MessageId)
            {
                return BadRequest();
            }

            _context.Entry(message).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!messageExists(messageId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        [HttpDelete("{messageId}")]
        public async Task<ActionResult<Message>> DeleteMessage(int messageId)
        {
            var message = await _context.Messages.FindAsync(messageId);
            if (message == null)
            {
                return NotFound();
            }
            _context.Messages.Remove(message);
            await _context.SaveChangesAsync();
            return message;
        }

        private bool messageExists(int messageId)
        {
            var message = _context.Messages.FindAsync(messageId);
            if (message == null)
            {
                return false;
            }
            return true;
        }

    }
}