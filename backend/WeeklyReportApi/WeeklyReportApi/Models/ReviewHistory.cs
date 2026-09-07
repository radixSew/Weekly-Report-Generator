namespace WeeklyReportApi.Models
{
    public class ReviewHistory
    {
        public int Id { get; set; }

        public int ReportId { get; set; }

        public int ReviewerId { get; set; }

        public string Action { get; set; } = string.Empty;

        public string Comment { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public Report Report { get; set; } = null!;

        public User Reviewer { get; set; } = null!;
    }
}
