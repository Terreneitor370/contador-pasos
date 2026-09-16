export interface SessionSummary {
  steps: number;
  distanceMeters: number;
  durationMs: number;
}

export interface StepSession extends SessionSummary {
  id: string;
  endedAt: number;
}
