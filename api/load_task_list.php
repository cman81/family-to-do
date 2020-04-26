<?php
    require_once "AppDB.class.php";

    $db = new AppDB();
    $sql = "
        SELECT task_id, task_name, date_due, is_more
        FROM tasks
        WHERE date_completed IS NULL
        ORDER BY date_created DESC
    ";

    $stmt = $db->prepare($sql);

    $ret = $stmt->execute();

    $out = [];
    while ($row = $ret->fetchArray(SQLITE3_ASSOC)) {
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
