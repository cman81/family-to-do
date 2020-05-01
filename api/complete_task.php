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

    DB::startTransaction();
    $new_task = respawn($_GET);
    if (empty($new_task)) {
        DB::rollback();
        exit(json_encode($_GET));
    }

    try {
        respawn_details($_GET['taskId'], $new_task['id']);
    } catch (Exception $ex) {
        DB::rollback();
        exit(json_encode($ex));
    }

    try {
        respawn_subtasks($_GET['taskId'], $new_task['id']);
    } catch (Exception $ex) {
        DB::rollback();
        exit(json_encode($ex));
    }

    DB::commit();
    exit(json_encode($new_task));

    function respawn_subtasks($source_task_id, $target_task_id) {
        $subtask_names = DB::queryFirstColumn(
            "
                SELECT subtask_name
                FROM subtasks
                WHERE task_id = %i
            ",
            $source_task_id
        );

        foreach ($subtask_names as $subtask_name) {
            DB::insert(
                'subtasks',
                [
                    'task_id' => $target_task_id,
                    'subtask_name' => $subtask_name,
                ]
            );
        }
    }

    function respawn_details($source_task_id, $target_task_id) {
        $row = DB::queryFirstRow(
            "
                SELECT task_note, subtask_set_order
                FROM task_details
                WHERE task_id = %i
            ",
            $source_task_id
        );

        DB::insert(
            'task_details',
            [
                'task_id' => $target_task_id,
                'task_note' => $row['task_note'],
                'subtask_set_order' => $row['subtask_set_order']
            ],
        );
    }

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

        return [
            'id' => DB::insertId(),
            'dateDue' => $new_task['date_due']->format("D, M j"),
            'dateTimestamp' => $new_task['date_due']->getTimestamp(),
            'isMore' => $new_task['is_more'],
            'name' => $new_task['task_name'],
            'respawn' => $new_task['respawn'],
        ];
    }
