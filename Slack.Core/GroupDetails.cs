using System;
using System.Collections.Generic;
using System.Text;

namespace Slack.Core
{
    public class GroupDetails
    {
        public int WorkspaceId { get; set; }
        public int GroupId { get; set; }
        public string GroupName { get; set; }
        public bool IsActive { get; set; }
        public List<User> Users { get; set; }
    }
}
