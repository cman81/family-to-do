<?php
    require_once "AppDB.class.php";

    $db = new AppDB();
    $sql = "
        SELECT task_id, task_name, date_due, is_more
        FROM tasks
        WHERE date_completed IS NULL
    ";

    $stmt = $db->prepare($sql);

    $ret = $stmt->execute();

    $out = [];
    while ($row = $ret->fetchArray(SQLITE3_ASSOC)) {
        $out[] = [
            'id' => $row['task_id'],
            'name' => $row['task_name'],
            'dateDue' => date("D, M j", $row['date_due']), // e.g.: Fri, Apr 4
            'isMore' => ($row['is_more'] == 1),
        ];
    }

    exit(json_encode($out));
