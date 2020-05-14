<?php
    require __DIR__ . '/../vendor/autoload.php';
    require_once "AppDB.class.php";
    require_once "helpers.php";

    $next_week = new DateTime('+7 days');
    $results = get_future_tasks($_GET['userId'], $next_week);

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
                'categoryName' => get_category_by_date($row['date_due']),
            ];
        },
        $results
    );

    $categories = [];
    foreach ($out as $value) {
        $key = $value['categoryName'];
        if (empty($categories[$key])) { $categories[$key] = []; }
        $categories[$key][] = $value;
    }

    exit(json_encode($categories));

    /**
     * @param string $date_due A date string compatible with strtotime().
     * @return string
     */
    function get_category_by_date($date_due) {
        $today = strtotime('11:59pm');

        if (strtotime($date_due) < $today) {
            return get_formatted_date('midnight') . ' (today)';
        }

        return get_formatted_date($date_due);
    }
