<?php
    require __DIR__ . '/../vendor/autoload.php';
    require_once "AppDB.class.php";

    $row = DB::queryFirstRow(
        "
            SELECT t.task_id, t.task_name, t.date_due, td.task_note, td.subtask_set_order
            FROM tasks t
            LEFT OUTER JOIN task_details td ON td.task_Id = t.task_id
            WHERE t.task_id = %i
        ",
        $_GET['taskId']
    );

    if (empty($row)) {
        exit(json_encode(FALSE));
    }

    $formatted_date = false;
    if ($row['date_due']) {
        // e.g.: Fri, Apr 4
        $formatted_date = date("Y-m-d", strtotime($row['date_due']));
    }

    exit(json_encode([
        'id' => $row['task_id'],
        'name' => $row['task_name'],
        'dateDue' => $formatted_date,
        'taskNote' => $row['task_note'],
        'subtaskSetOrder' => $row['subtask_set_order'] ?? FALSE,
    ]));
