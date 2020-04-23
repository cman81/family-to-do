BEGIN TRANSACTION;
DROP TABLE IF EXISTS `tasks`;
CREATE TABLE IF NOT EXISTS `tasks` (
	`task_id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`task_name`	TEXT,
	`date_created`	INTEGER,
	`date_due`	INTEGER,
	`date_completed`	INTEGER,
	`is_completed`	INTEGER
);
COMMIT;
