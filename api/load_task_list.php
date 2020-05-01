<?php
    require __DIR__ . '/../vendor/autoload.php';
    require_once "AppDB.class.php";

    $results = DB::query("
        SELECT t.task_id, t.task_name, t.date_due, t.respawn
        FROM tasks t
        WHERE t.date_completed IS NULL
        ORDER BY t.date_created DESC
    ");

    $is_more_map = build_map($results);
    $out = array_map(
        function($row) use ($is_more_map) {
            return [
                'id' => $row['task_id'],
                'name' => $row['task_name'],
                'dateTimestamp' => strtotime($row['date_due']) ?? FALSE,
                'dateDue' => get_formatted_date($row['date_due']),
                'isMore' => $is_more_map[$row['task_id']],
                'respawn' => $row['respawn'] ?? FALSE,
            ];
        },
        $results
    );

    exit(json_encode($out));

    /**
     * Build a mapping array to determine which tasks have notes/subtasks, and which ones do not.
     */
    function build_map($results) {
        $extra_results = DB::query(
            "
                SELECT t.task_id, td.task_note, s.subtask_name
                FROM tasks t
                LEFT OUTER JOIN task_details td ON t.task_id = td.task_id 
                LEFT OUTER JOIN subtasks s ON t.task_id = s.task_id
                WHERE t.task_id IN %li
            ",
            array_map(function($row) { return $row['task_id']; }, $results)
        );

        $is_more_map = [];
        foreach ($extra_results as $row) {
            $is_more_map[$row['task_id']] = has_extra_details($row);
        }

        return $is_more_map;
    }

    function get_formatted_date($date) {
        if (empty($date)) { return FALSE; }
        
        // e.g.: Fri, Apr 4
        return date("D, M j", strtotime($date));
    }

    function has_extra_details($row) {
        if (!empty($row['task_note'])) { return TRUE; }
        if (!empty($row['subtask_name'])) { return TRUE; }

        return FALSE;
    }
