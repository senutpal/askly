import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
	"fail stale crawl jobs",
	{ minutes: 15 },
	internal.system.maintenance.failStaleCrawlJobs,
);

crons.interval(
	"cleanup expired contact sessions",
	{ hours: 6 },
	internal.system.maintenance.cleanupExpiredContactSessions,
);

crons.interval(
	"cleanup old crawl data",
	{ hours: 1 },
	internal.system.maintenance.cleanupOldCrawlData,
);

crons.interval(
	"cleanup rate limit buckets",
	{ hours: 1 },
	internal.system.maintenance.cleanupRateLimits,
);

export default crons;
