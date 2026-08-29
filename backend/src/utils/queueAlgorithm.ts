export interface QueueJobInput {
  jobId: string;
  pages: number;
  copies: number;
  createdAt: Date;
  printerPpm?: number; // pages per minute (default 30)
}

export interface CalculatedQueueJob extends QueueJobInput {
  totalPaperCount: number;
  estimatedDurationSeconds: number;
  waitingMinutes: number;
  shortJobScore: number;
  waitingScore: number;
  priorityScore: number;
}

export const calculatePriorityScore = (job: QueueJobInput, now: Date = new Date()): CalculatedQueueJob => {
  const ppm = job.printerPpm || 30; // default 30 pages per minute
  const totalPaperCount = Math.max(1, job.pages) * Math.max(1, job.copies);
  
  // Estimated print time in seconds
  const estimatedDurationSeconds = Math.ceil((totalPaperCount / ppm) * 60);

  // Minutes waiting in queue
  const waitingMs = Math.max(0, now.getTime() - new Date(job.createdAt).getTime());
  const waitingMinutes = Math.floor(waitingMs / (1000 * 60));

  // 1. Short job score: inverse of paper count (fewer pages -> higher score)
  const shortJobScore = 1000 / Math.max(1, totalPaperCount);

  // 2. Anti-starvation waiting score: 10 points bonus for each minute waiting
  const waitingScore = waitingMinutes * 10;

  // Total Priority Score = Short Job Score + Waiting Score
  const priorityScore = Math.round((shortJobScore + waitingScore) * 100) / 100;

  return {
    ...job,
    totalPaperCount,
    estimatedDurationSeconds,
    waitingMinutes,
    shortJobScore,
    waitingScore,
    priorityScore,
  };
};

export const sortQueueByPriority = (jobs: QueueJobInput[], now: Date = new Date()): CalculatedQueueJob[] => {
  const calculated = jobs.map((job) => calculatePriorityScore(job, now));
  // Sort descending by priority score (highest priority first)
  return calculated.sort((a, b) => b.priorityScore - a.priorityScore);
};
