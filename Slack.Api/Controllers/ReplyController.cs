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
    public class ReplyController : ControllerBase
    {
        private readonly SlackDbContext _context;

        public ReplyController(SlackDbContext _context)
        {
            this._context = _context;
        }
        [HttpPost]
        public async Task<ActionResult<Reply>> AddReply(Reply reply)
        {
            _context.Replies.Add(reply);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetReply), new { ReplyId = reply.ReplyId }, reply);
        }

        [HttpGet("{replyId}")]
        public async Task<ActionResult<Reply>> GetReply(int replyId)
        {
            var reply = await _context.Replies.FindAsync(replyId);
            if (reply == null)
            {
                return NotFound();
            }
            return reply;
        }

        [HttpGet("message/{messageId}")]
        public async Task<IEnumerable<ReplyDetails>> GetAllReply(int messageId)
        {
            var reply = await (from r in _context.Replies
                               join u in _context.Users on r.SentBy equals u.UserId
                               join uf in _context.Users on r.ReceivedBy equals uf.UserId
                               where r.MessageId == messageId
                               select new ReplyDetails
                               {
                                   ReplyId = r.ReplyId,
                                   ReplyDescription = r.ReplyMessage,
                                   MessageId = r.MessageId,
                                   sendById = r.SentBy,
                                   ReceivedById = r.ReceivedBy,
                                   sendByName = u.DisplayName,
                                   ReceivedByName = uf.DisplayName,
                                   CreatedAt = r.CreatedAt
                               }).ToListAsync();
            return reply;
        }

        [HttpPut("{ReplyId}")]
        public async Task<IActionResult> UpdateReply(int replyId, Reply reply)
        {
            if (replyId != reply.ReplyId)
            {
                return BadRequest();
            }

            _context.Entry(reply).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!replyExists(replyId))
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

        [HttpDelete("{replyId}")]
        public async Task<ActionResult<Reply>> DeleteReply(int replyId)
        {
            var reply = await _context.Replies.FindAsync(replyId);
            if (reply == null)
            {
                return NotFound();
            }
            _context.Replies.Remove(reply);
            await _context.SaveChangesAsync();
            return reply;
        }

        private bool replyExists(int replyId)
        {
            var reply = _context.Replies.FindAsync(replyId);
            if (reply == null)
            {
                return false;
            }
            return true;
        }

    }
}