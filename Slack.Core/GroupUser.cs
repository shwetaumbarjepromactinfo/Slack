using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Slack.Core
{
    public class GroupUser
    {
        [Key]
        public int GroupUserId { get; set; }
        public int GroupId { get; set; }
        public int UserId { get; set; }
        public bool IsActive { get; set; }

    }
}
