using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Slack.Core
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        public string FullName { get; set; }
        public string DisplayName { get; set; }
        public string position { get; set; }
        public string UserEmail { get; set; }
        public string UserPassword { get; set; }
        public string PhoneNumber { get; set; }
        public string ImagePath { get; set; }
        public string UserStatus { get; set; }
        public bool IsOnline { get; set; }
        public bool IsActive { get; set; }
        public string CreatedAt { get; set; }
        public string ModifiedAt { get; set; }
        public bool IsDonNotDistrub { get; set; }
    }
}
