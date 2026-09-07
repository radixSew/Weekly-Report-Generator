using WeeklyReportApi.DTOs;

namespace WeeklyReportBackend.DTOs
{
    public class UpdateReportRequest
    {
        public int ProjectId { get; set; }

        public DateTime WeekStart { get; set; }

        public DateTime WeekEnd { get; set; }

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

        public List<ReportTaskRequest> Tasks { get; set; }
            = new();
    }
}