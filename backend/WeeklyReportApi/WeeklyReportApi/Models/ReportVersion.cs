namespace WeeklyReportApi.Models
{
    public class ReportVersion
    {
        public int Id { get; set; }

        public int ReportId { get; set; }

        public int VersionNumber { get; set; }

        public DateTime SubmissionTimestamp { get; set; }

        public string SnapshotJson { get; set; } = string.Empty;

        public string SubmittedBy { get; set; } = string.Empty;

        public Report Report { get; set; } = null!;
    }
}
