<?php
    require __DIR__ . '/../vendor/autoload.php';
    require_once "AppDB.class.php";

    $results = DB::query("
        SELECT task_id, task_name, date_due, is_more
        FROM tasks
        WHERE date_completed IS NULL
        ORDER BY date_created DESC
    ");

    $out = [];
    foreach ($results as $row) {
        $formatted_date = false;
        if ($row['date_due']) {
            // e.g.: Fri, Apr 4
            $formatted_date = date("D, M j", $row['date_due']);
        }

        $out[] = [
            'id' => $row['task_id'],
            'name' => $row['task_name'],
            'dateTimestamp' => $row['date_due'],
            'dateDue' => $formatted_date,
            'isMore' => ($row['is_more'] == 1),
        ];
    }

    exit(json_encode($out));
