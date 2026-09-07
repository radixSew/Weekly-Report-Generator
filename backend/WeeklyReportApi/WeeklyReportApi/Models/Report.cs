namespace WeeklyReportApi.Models
{
    public class Report
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public int ProjectId { get; set; }

        public DateTime WeekStart { get; set; }

        public DateTime WeekEnd { get; set; }

        public string Status { get; set; } = "Draft";

        public string TasksPlannedNextWeek { get; set; }
            = string.Empty;

        public string Blockers { get; set; }
            = string.Empty;

        public bool KeyBlocker { get; set; }

        public string Achievements { get; set; }
            = string.Empty;

        public bool KeyAchievement { get; set; }

        public decimal DevelopmentHours { get; set; }

        public decimal TestingHours { get; set; }

        public decimal MeetingHours { get; set; }

        public decimal DocumentationHours { get; set; }

        public string Notes { get; set; }
            = string.Empty;

        public DateTime? SubmittedAt { get; set; }

        public DateTime? LastReviewedAt { get; set; }

        public int? LastReviewerId { get; set; }

        public string LatestReviewComment { get; set; }
            = string.Empty;

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public User User { get; set; } = null!;

        public Project Project { get; set; } = null!;

        public ICollection<ReportTask> Tasks { get; set; }
            = new List<ReportTask>();

        public ICollection<ReportVersion> Versions { get; set; }
            = new List<ReportVersion>();

        public ICollection<ReviewHistory> Reviews { get; set; }
            = new List<ReviewHistory>();
    }
}
