﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Slack.Data;

namespace Slack.Data.Migrations
{
    [DbContext(typeof(SlackDbContext))]
    partial class SlackDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.1.14-servicing-32113")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Slack.Core.Message", b =>
                {
                    b.Property<int>("MessageId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("CreatedAt");

                    b.Property<bool>("IsActive");

                    b.Property<string>("MessageDescription");

                    b.Property<int>("ReceivedBy");

                    b.Property<int>("SentBy");

                    b.Property<string>("UpdatedAt");

                    b.Property<int>("WorkspaceId");

                    b.HasKey("MessageId");

                    b.ToTable("Messages");
                });

            modelBuilder.Entity("Slack.Core.RecentChat", b =>
                {
                    b.Property<int>("RecentChatId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("FriendId");

                    b.Property<int>("UserId");

                    b.Property<int>("WorkspaceId");

                    b.HasKey("RecentChatId");

                    b.ToTable("RecentChats");
                });

            modelBuilder.Entity("Slack.Core.Reply", b =>
                {
                    b.Property<int>("ReplyId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("CreatedAt");

                    b.Property<bool>("IsActive");

                    b.Property<int>("MessageId");

                    b.Property<int>("ReceivedBy");

                    b.Property<string>("ReplyMessage");

                    b.Property<int>("SentBy");

                    b.Property<string>("UpdatedAt");

                    b.HasKey("ReplyId");

                    b.ToTable("Replies");
                });

            modelBuilder.Entity("Slack.Core.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("CreatedAt");

                    b.Property<string>("DisplayName");

                    b.Property<string>("FullName");

                    b.Property<string>("ImagePath");

                    b.Property<bool>("IsActive");

                    b.Property<bool>("IsDonNotDistrub");

                    b.Property<bool>("IsOnline");

                    b.Property<string>("ModifiedAt");

                    b.Property<string>("PhoneNumber");

                    b.Property<string>("UserPassword");

                    b.Property<string>("UserStatus");

                    b.Property<string>("position");

                    b.HasKey("UserId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Slack.Core.UserWorkspace", b =>
                {
                    b.Property<int>("UserWorkspaceId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("CreatedAt");

                    b.Property<bool>("IsActive");

                    b.Property<int>("UserId");

                    b.Property<int>("WorkspaceId");

                    b.HasKey("UserWorkspaceId");

                    b.ToTable("UserWorkspaces");
                });

            modelBuilder.Entity("Slack.Core.Workspace", b =>
                {
                    b.Property<int>("WorkSpaceId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("CreatedAt");

                    b.Property<bool>("IsActive");

                    b.Property<string>("WorkSpaceLink");

                    b.Property<string>("WorkSpaceName");

                    b.HasKey("WorkSpaceId");

                    b.ToTable("Workspaces");
                });
#pragma warning restore 612, 618
        }
    }
}
