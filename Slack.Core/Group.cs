using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Slack.Core
{
    public class Group
    {
        [Key]
        public int GroupId { get; set; }
        public int WorkspaceId { get; set; }
        public string GroupName { get; set; }
        public bool IsActive { get; set; }

    }
}
