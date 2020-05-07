<?php
    require __DIR__ . '/../vendor/autoload.php';
    require_once "AppDB.class.php";
    require_once "helpers.php";

    $results = DB::query(
        "
            SELECT task_id, task_name, date_due, respawn, category
            FROM tasks
            WHERE date_completed IS NULL
            AND task_group_id = %i
        ",
        $_GET['groupId']
    );

    if (empty($results)) { exit(json_encode(['default category' => []])); }

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
                'groupId' => $_GET['groupId'],
                'categoryName' => $row['category'],
            ];
        },
        $results
    );

    $categories = [];
    foreach ($out as $value) {
        $key = $value['categoryName'] ?? 'Default Category';
        $key = strtolower($key);
        if (empty($categories[$key])) { $categories[$key] = []; }
        $categories[$key][] = $value;
    }

    ksort($categories);

    // move 'Default Category' to the end of the array
    // @see https://stackoverflow.com/a/2359684
    $key = strtolower('Default Category');
    $default_category = $categories[$key];
    unset($categories[$key]);
    $categories[$key] = $default_category;

    exit(json_encode($categories));
