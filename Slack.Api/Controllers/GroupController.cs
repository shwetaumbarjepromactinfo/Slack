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
    public class GroupController : ControllerBase
    {
        private readonly SlackDbContext _context;

        public GroupController(SlackDbContext _context)
        {
            this._context = _context;
        }

        [HttpPost]
        public async Task<ActionResult<Group>> AddGroup(Group group)
        {
            _context.Groups.Add(group);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetGroup), new { GroupId = group.GroupId }, group);
        }

        [HttpGet("{groupId}")]
        public async Task<IEnumerable<GroupDetails>> GetGroup(int groupId)
        {
            var group = await (from g in _context.Groups
                               where g.GroupId == groupId
                               select new GroupDetails
                               {
                                   GroupId = g.GroupId,
                                   GroupName = g.GroupName,
                                   IsActive = g.IsActive,
                                   Users = (from u in _context.Users
                                            join gu in _context.GroupUsers on u.UserId equals gu.UserId
                                            where gu.GroupId == groupId
                                            select new User { 
                                             UserId=u.UserId,
                                             UserEmail= u.UserEmail,
                                             FullName = u.FullName,
                                             UserStatus = u.UserStatus,
                                             PhoneNumber = u.PhoneNumber,
                                             ImagePath = u.ImagePath,
                                             IsOnline = u.IsOnline
                                            }).ToList()
                               }).ToListAsync();
            
            return group;
        }

        [HttpGet("{userId}/all-group")]
        public async Task<IEnumerable<Group>> GetGroupByUserId(int userId)
        {
            var group = await (from g in _context.Groups
                               join gu in _context.GroupUsers on g.GroupId equals gu.GroupId
                               where gu.UserId == userId
                               select new Group
                               {
                                   GroupId = g.GroupId,
                                   GroupName = g.GroupName,
                                   IsActive = g.IsActive
                               }).ToListAsync();

            return group;
        }

        [HttpGet("{groupId}/get-messages")]
        public async Task<IEnumerable<MessageDetails>> GetAllMessage(int groupId)
        {
            var message = await (from m in _context.Messages
                                 join u in _context.Users on m.SentBy equals u.UserId
                                 where m.GroupId == groupId 
                                 select new MessageDetails
                                 {
                                     WorkspaceId = m.WorkspaceId,
                                     MessageId = m.MessageId,
                                     GroupId = m.GroupId,
                                     MessageDescription = m.MessageDescription,
                                     CreatedAt = m.CreatedAt,
                                     SendById = m.SentBy,
                                     SendByName = u.DisplayName,
                                     SendByImagePath = u.ImagePath
                                 }
                                 ).ToListAsync();
            return message;
        }

    }
}