BEGIN TRANSACTION;

DROP TABLE IF EXISTS `tasks`;
CREATE TABLE IF NOT EXISTS `tasks` (
	`task_id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`task_name`	TEXT,
	`date_created`	INTEGER,
	`date_due`	INTEGER,
	`date_completed`	INTEGER,
	`is_more`	INTEGER NOT NULL DEFAULT 0
);

DROP TABLE IF EXISTS `task_details`;
CREATE TABLE "task_details" (
	"detail_id"	INTEGER PRIMARY KEY AUTOINCREMENT,
	"task_id"	INTEGER,
	"task_note"	TEXT
)

COMMIT;
