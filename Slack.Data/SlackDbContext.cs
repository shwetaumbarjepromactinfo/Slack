using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Slack.Core;
using System;
using System.Collections.Generic;
using System.Text;

namespace Slack.Data
{
    public class SlackDbContext : DbContext
    {
        public SlackDbContext(DbContextOptions<SlackDbContext> options) : base(options)
        {

        }

        public DbSet<User> Users { get; set; }
        public DbSet<Workspace> Workspaces { get; set; }
        public DbSet<RecentChat> RecentChats { get; set; }
        public DbSet<Reply> Replies { get; set; }
        public DbSet<UserWorkspace> UserWorkspaces { get; set; }
        public DbSet<Message> Messages { get; set; }
    }

    public class SlackDbContextFactory : IDesignTimeDbContextFactory<SlackDbContext>
    {
        SlackDbContext IDesignTimeDbContextFactory<SlackDbContext>.CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<SlackDbContext>();
            optionsBuilder.UseSqlServer<SlackDbContext>("Server = (localdb)\\mssqllocaldb; Database = SlackDb; Trusted_Connection = False; MultipleActiveResultSets = true");

            return new SlackDbContext(optionsBuilder.Options);
        }
    }
}
