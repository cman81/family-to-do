<?php
    require __DIR__ . '/../vendor/autoload.php';
    require_once "AppDB.class.php";

    DB::query(
        "
            UPDATE tasks
            SET date_completed = %t
            WHERE task_id = %i
        ",
        new DateTime(),
        $_GET['taskId']
    );

    if (empty($_GET['dateDue'])) { exit(json_encode($_GET)); }
    if (empty($_GET['respawn'])) { exit(json_encode($_GET)); }

    $new_task = respawn($_GET);
    if (empty($new_task)) { exit(json_encode($_GET)); }
    exit(json_encode($new_task));

    function respawn($completed_task) {
        // Spawn a new task based on the one we just completed
        switch ($completed_task['respawn']) {
            case 'daily':
                $date_bump = '+1 day';
                break;
            case 'weekly':
                $date_bump = '+1 week';
                break;
            case 'monthly':
                $date_bump = '+1 month';
                break;
            case 'yearly':
                $date_bump = '+1 year';
                break;
            default:
                $date_bump = "+{$completed_task['respawn']}";
        }

        $row = DB::queryFirstRow(
            "
                SELECT task_name, is_more, date_due
                FROM tasks
                WHERE task_id = %i
            ",
            $_GET['taskId']
        );

        if (empty($row)) { return FALSE; }

        $new_due_date = strtotime($date_bump, strtotime($row['date_due']));
        if (empty($new_due_date)) { return FALSE; }

        $new_task = [
            'task_name' => $row['task_name'],
            'date_created' => new DateTime(),
            'date_due' => new DateTime("@$new_due_date"), // @see https://www.php.net/manual/en/function.date-create.php#76216
            'is_more' => $row['is_more'],
            'respawn' => $completed_task['respawn'],
        ];
        DB::insert(
            'tasks',
            $new_task  
        );

        $new_task['id'] = DB::insertId();

        return $new_task;
    }
