<?php
    require __DIR__ . '/../vendor/autoload.php';
    require_once "AppDB.class.php";

    $results = DB::query("
        SELECT t.task_id, t.task_name, t.date_due, t.is_more, t.respawn, td.task_note, s.subtask_name
        FROM tasks t
        LEFT OUTER JOIN task_details td ON t.task_id = td.task_id 
        LEFT OUTER JOIN subtasks s ON t.task_id = s.task_id 
        WHERE t.date_completed IS NULL
        ORDER BY t.date_created DESC
    ");

    exit(json_encode(array_map(
        function($row) {
            return [
                'id' => $row['task_id'],
                'name' => $row['task_name'],
                'dateTimestamp' => $row['date_due'] ?? FALSE,
                'dateDue' => get_formatted_date($row['date_due']),
                'isMore' => has_extra_details($row),
                'respawn' => $row['respawn'] ?? FALSE,
            ];
        },
        $results
    )));

    function get_formatted_date($date) {
        if (empty($date)) { return FALSE; }
        
        // e.g.: Fri, Apr 4
        return date("D, M j", strtotime($row['date_due']));
    }

    function has_extra_details($row) {
        if (!empty($row['task_note'])) { return TRUE; }
        if (!empty($row['subtask_name'])) { return TRUE; }

        return FALSE;
    }
