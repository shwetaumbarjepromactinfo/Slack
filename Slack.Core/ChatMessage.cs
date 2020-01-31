using System;
using System.Collections.Generic;
using System.Text;

namespace Slack.Core
{
    public class ChatMessage
    {
        public int userId { get; set; }
        public string user { get; set; }

        public string message { get; set; }

        public string room { get; set; }
    }
}
