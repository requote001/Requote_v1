# Worker jobs

Add BullMQ processors here by domain. Planned first jobs include outbox dispatch, notification delivery, media inspection, matching refresh, scheduled dependency checks, and payment reconciliation. Every job needs a deterministic ID, retry policy, deduplication key, and reviewed dead-letter handling.
