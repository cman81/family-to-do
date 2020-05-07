<?php

/**
 * Sort the tasks as follows:
 * - items due today
 * - overdue items
 * - items due in the future
 * - items without a due date
 */
function task_list_sort($a, $b) {
    if (empty($a['date_due'])) { return 1; }
    if (empty($b['date_due'])) { return -1; }

    $today = new DateTime();
    $today->setTime(0, 0);

    $date_a = new DateTime($a['date_due']);
    $date_a->setTime(0, 0);

    $date_b = new DateTime($b['date_due']);
    $date_b->setTime(0, 0);

    if ($today == $date_a) { return -1; }
    if ($today == $date_b) { return 1; }

    return $date_a->diff($date_b)->invert ? 1 : -1;
};

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