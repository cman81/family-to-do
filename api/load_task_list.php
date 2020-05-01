<?php
    require __DIR__ . '/../vendor/autoload.php';
    require_once "AppDB.class.php";

    $results = DB::query("
        SELECT task_id, task_name, date_due, is_more, respawn
        FROM tasks
        WHERE date_completed IS NULL
        ORDER BY date_created DESC
    ");

    exit(json_encode(array_map(
        function($row) {
            $formatted_date = false;
            if ($row['date_due']) {
                // e.g.: Fri, Apr 4
                $formatted_date = date("D, M j", strtotime($row['date_due']));
            }

            return [
                'id' => $row['task_id'],
                'name' => $row['task_name'],
                'dateTimestamp' => $row['date_due'] ?? FALSE,
                'dateDue' => $formatted_date,
                'isMore' => ($row['is_more'] == 1),
                'respawn' => $row['respawn'] ?? FALSE,
            ];
        },
        $results
    )));
