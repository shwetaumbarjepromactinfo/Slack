using System;
using System.Collections.Generic;
using System.Text;

namespace Slack.Core
{
    public class MessageDetails
    {
        public int WorkspaceId { get; set; }
        public int MessageId { get; set; }
        public string MessageDescription { get; set; }
        public string CreatedAt { get; set; }
        public int SendById { get; set; }
        public string SendByName { get; set; }
        public int ReceivedBy { get; set; }
        public string ReceivedByName { get; set; }
        public string SendByImagePath { get; set; }
        public string ReceivedByImagePath { get; set; }
    }
}
