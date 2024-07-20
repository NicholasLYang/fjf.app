export interface PullRequest {
  title: string;
  number: number;
  status: Status;
  repository: string;
}

export enum Status {
  Merged = "MERGED",
  Blocked = "BLOCKED",
  Ready = "READY",
}
