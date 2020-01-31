using System;
using System.Collections.Generic;
using System.Text;

namespace Slack.Core
{
    public class ReplyDetails
    {
        public int MessageId { get; set; }
        public int ReplyId { get; set; }
        public string ReplyDescription { get; set; }
        public string sendByName { get; set; }
        public int sendById { get; set; }
        public int ReceivedById { get; set; }
        public string ReceivedByName { get; set; }
        public string CreatedAt { get; set; }
       

    }
}
