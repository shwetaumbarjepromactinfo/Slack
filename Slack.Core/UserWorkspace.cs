using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Slack.Core
{
    public class UserWorkspace
    {
        [Key]
        public int UserWorkspaceId { get; set; }
        public int WorkspaceId { get; set; }
        public int UserId { get; set; }
        public string CreatedAt { get; set; }
        public bool IsActive { get; set; }
    }
}
