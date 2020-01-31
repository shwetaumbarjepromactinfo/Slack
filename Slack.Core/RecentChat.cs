using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Slack.Core
{
    public class RecentChat
    {
        [Key]
        public int RecentChatId { get; set; }
        public int UserId { get; set; }
        public int FriendId { get; set; }
        public int WorkspaceId { get; set; }
    }
}
