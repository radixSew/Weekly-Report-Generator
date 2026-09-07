namespace WeeklyReportApi.DTOs
{
    public class ReportTaskRequest
    {
        public string TaskName { get; set; } = string.Empty;

        public string Priority { get; set; } = "Medium";

        public decimal PlannedPercent { get; set; }

        public decimal ActualPercent { get; set; }

        public string Status { get; set; } = "Not Started";

        public decimal PlannedHours { get; set; }

        public decimal SpentHours { get; set; }

        public string Deliverable { get; set; } = string.Empty;
    }
}