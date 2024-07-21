import { Session } from "next-auth";

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

export interface SessionWithToken extends Session {
  accessToken: string;
}
