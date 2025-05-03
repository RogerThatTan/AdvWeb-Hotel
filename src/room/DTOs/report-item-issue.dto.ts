import { IsString } from 'class-validator';

export class ReportItemIssueDto {
  @IsString()
  issue_report: string;
}
