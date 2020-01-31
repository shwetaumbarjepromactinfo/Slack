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
    public class UserController : ControllerBase
    {
        private readonly SlackDbContext _context;

        public UserController(SlackDbContext _context) 
        {
            this._context = _context;
        }
        [HttpPost]
        public async Task<ActionResult<User>> AddUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUser), new { UserId = user.UserId }, user);
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<User>> GetUser(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpGet("{userEmail}/{userPassword}")]
        public async Task<ActionResult<User>> GetUserLogin(string userEmail, string userPassword)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.UserEmail==userEmail && u.UserPassword == userPassword);
            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpGet("{userId}/workspace/{workspaceId}")]
        public async Task<IEnumerable<User>> GetUserRecentChatList(int userId,int workspaceId)
        {
            var user = await (from u in _context.Users
                              join r in _context.RecentChats on u.UserId equals r.FriendId == userId ? r.UserId : r.FriendId 
                              where (r.UserId == userId || r.FriendId == userId) && r.WorkspaceId == workspaceId
                              select u
                              ).ToListAsync();
            return user;
        }

        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateUser(int userId, User user)
        {
            if (userId != user.UserId)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!userExists(userId))
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

        [HttpDelete("{userId}")]
        public async Task<ActionResult<User>> DeleteUser(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound();
            }
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return user;
        }

        private bool userExists(int userId)
        {
            var user = _context.Users.FindAsync(userId);
            if (user == null)
            {
                return false;
            }
            return true;
        }
    }
}