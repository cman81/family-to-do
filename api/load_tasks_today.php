<?php
    require __DIR__ . '/../vendor/autoload.php';
    require_once "AppDB.class.php";
    require_once "helpers.php";

    $tomorrow = new DateTime('tomorrow');
    $tomorrow->setTime(0, 0);

    $results = DB::query(
        "
            SELECT t.task_id, t.task_name, t.date_due, t.respawn, tg.group_id, tg.group_name
            FROM tasks t
            INNER JOIN task_groups tg ON tg.group_id = t.task_group_id 
            WHERE (
                tg.owner_id = %i
                OR is_public = 1
            )
            AND date_completed IS NULL
            AND date_due IS NOT NULL
            AND date_due < %t
        ",
        $_GET['userId'],
        $tomorrow
    );

    if (empty($results)) { exit(json_encode([])); }

    usort($results, "task_list_sort");

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
                'groupId' => $row['group_id'],
                'groupName' => $row['group_name'],
            ];
        },
        $results
    );

    $groups = [];
    foreach ($out as $value) {
        $key = $value['groupName'];
        if (empty($groups[$key])) { $groups[$key] = []; }
        $groups[$key][] = $value;
    }

    exit(json_encode($groups));
