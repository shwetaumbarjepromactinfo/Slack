using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Slack.Core
{
    public class Message
    {
        [Key]
        public int MessageId { get; set; }
        public int WorkspaceId { get; set; }
        public int SentBy { get; set; }
        public int ReceivedBy { get; set; }
        public string MessageDescription { get; set; }
        public string CreatedAt { get; set; }
        public string UpdatedAt { get; set; }
        public bool IsActive { get; set; }

    }
}
