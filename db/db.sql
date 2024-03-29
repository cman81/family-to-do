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
	"task_note"	TEXT,
	"subtask_set_order" TEXT
)

CREATE UNIQUE INDEX "unique_note" ON "task_details" (
	"task_id"
);

DROP TABLE IF EXISTS `subtasks`;
CREATE TABLE `subtasks` ( `subtask_id` INTEGER PRIMARY KEY AUTOINCREMENT, `task_id` INTEGER, `subtask_name` INTEGER, `date_completed` INTEGER )

COMMIT;
