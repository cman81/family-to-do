<?php
    require_once "AppDB.class.php";

    $db = new AppDB();
    $sql = "
        SELECT t.task_id, t.task_name, t.date_due, td.task_note
        FROM tasks t
        LEFT OUTER JOIN task_details td ON td.task_Id = t.task_id
        WHERE t.task_id = :task_id
    ";

    $stmt = $db->prepare($sql);
    $stmt->bindValue(':task_id', $_GET['taskId']);
    $ret = $stmt->execute();

    $out = false;
    while ($row = $ret->fetchArray(SQLITE3_ASSOC)) {
        $formatted_date = false;
        if ($row['date_due']) {
            // e.g.: Fri, Apr 4
            $formatted_date = date("Y-m-d", $row['date_due']);
        }

        $out = [
            'id' => $row['task_id'],
            'name' => $row['task_name'],
            'dateDue' => $formatted_date,
            'taskNote' => $row['task_note'],
        ];

        // we are only expecting one result 
        break;
    }

    exit(json_encode($out));
