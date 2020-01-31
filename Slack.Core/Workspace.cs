using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Slack.Core
{
    public class Workspace
    {
        [Key]
        public int WorkSpaceId { get; set; }
        public string WorkSpaceName { get; set; }
        public string WorkSpaceLink { get; set; }
        public bool IsActive { get; set; }
        public string CreatedAt { get; set; }
    }
}
