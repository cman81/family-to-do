<?php
    require __DIR__ . '/../vendor/autoload.php';
    require_once "AppDB.class.php";

    $results = DB::query(
        "
            SELECT subtask_id, subtask_name, date_completed
            FROM subtasks
            WHERE task_id = %i
            ORDER BY subtask_id
        ",
        $_GET['taskId']
    );

    exit(json_encode(array_map(
        function($row) {
            return [
                'id' => $row['subtask_id'],
                'name' => $row['subtask_name'],
                'isComplete' => (!empty($row['date_completed'])),
            ];
        },
        $results
    )));
