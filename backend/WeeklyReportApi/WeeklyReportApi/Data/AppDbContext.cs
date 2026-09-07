using Microsoft.EntityFrameworkCore;
using WeeklyReportApi.Models;

namespace WeeklyReportApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(
            DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();

        public DbSet<Project> Projects => Set<Project>();

        public DbSet<Report> Reports => Set<Report>();

        public DbSet<ReportTask> ReportTasks => Set<ReportTask>();

        public DbSet<ReportVersion> ReportVersions => Set<ReportVersion>();

        public DbSet<ReviewHistory> ReviewHistories => Set<ReviewHistory>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // =====================================================
            // USER
            // =====================================================

            builder.Entity<User>()
                .HasIndex(x => x.Email)
                .IsUnique();


            // =====================================================
            // PROJECT
            // =====================================================

            builder.Entity<Project>()
                .HasIndex(x => x.Name)
                .IsUnique();


            // =====================================================
            // REPORT -> USER
            // =====================================================

            builder.Entity<Report>()
                .HasOne(x => x.User)
                .WithMany(x => x.Reports)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);


            // =====================================================
            // REPORT -> PROJECT
            // =====================================================

            builder.Entity<Report>()
                .HasOne(x => x.Project)
                .WithMany(x => x.Reports)
                .HasForeignKey(x => x.ProjectId)
                .OnDelete(DeleteBehavior.Restrict);


            // =====================================================
            // REPORT TASK -> REPORT
            // =====================================================

            builder.Entity<ReportTask>()
                .HasOne(x => x.Report)
                .WithMany(x => x.Tasks)
                .HasForeignKey(x => x.ReportId)
                .OnDelete(DeleteBehavior.Cascade);


            // =====================================================
            // REPORT VERSION -> REPORT
            // =====================================================

            builder.Entity<ReportVersion>()
                .HasOne(x => x.Report)
                .WithMany(x => x.Versions)
                .HasForeignKey(x => x.ReportId)
                .OnDelete(DeleteBehavior.Cascade);


            // =====================================================
            // REVIEW HISTORY -> REPORT
            // =====================================================

            builder.Entity<ReviewHistory>()
                .HasOne(x => x.Report)
                .WithMany(x => x.Reviews)
                .HasForeignKey(x => x.ReportId)
                .OnDelete(DeleteBehavior.Cascade);


            // =====================================================
            // REVIEW HISTORY -> REVIEWER
            // =====================================================

            builder.Entity<ReviewHistory>()
                .HasOne(x => x.Reviewer)
                .WithMany()
                .HasForeignKey(x => x.ReviewerId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}