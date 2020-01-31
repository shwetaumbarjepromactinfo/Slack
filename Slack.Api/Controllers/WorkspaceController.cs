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
    public class WorkspaceController : ControllerBase
    {

        private readonly SlackDbContext _context;

        public WorkspaceController(SlackDbContext _context)
        {
            this._context = _context;
        }
        [HttpPost]
        public async Task<ActionResult<Workspace>> AddWorkspace(Workspace workspace)
        {
            _context.Workspaces.Add(workspace);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetWorkspace), new { WorkspaceId = workspace.WorkSpaceId }, workspace);
        }

        [HttpGet("{workspaceId}/all-user")]
        public async Task<IEnumerable<User>> GetWorkspaceAllUser(int workspaceId)
        {
            var users = await (from u in _context.Users
                                   join uw in _context.UserWorkspaces on u.UserId equals uw.UserId
                                   select u).ToListAsync();
            return users;
        }

        [HttpGet("{workspaceId}")]
        public async Task<ActionResult<Workspace>> GetWorkspace(int workspaceId)
        {
            var workspace = await _context.Workspaces.FindAsync(workspaceId);
            if (workspace == null)
            {
                return NotFound();
            }
            return workspace;
        }

        [HttpGet("{workspaceName}/workspace-name")]
        public async Task<ActionResult<Workspace>> GetWorkspaceByName(string workspaceName)
        {
            var workspace = await _context.Workspaces.SingleOrDefaultAsync(w=>w.WorkSpaceName == workspaceName);
            if (workspace == null)
            {
                return NotFound();
            }
            return workspace;
        }

        [HttpDelete("{userId}")]
        public async Task<ActionResult<Workspace>> DeleteWorkspace(int workspaceId)
        {
            var workspace = await _context.Workspaces.FindAsync(workspaceId);
            if (workspace == null)
            {
                return NotFound();
            }
            _context.Workspaces.Remove(workspace);
            await _context.SaveChangesAsync();
            return workspace;
        }
    }
}