<?php
    require_once "AppDB.class.php";

    $db = new AppDB();
    $sql = "
        SELECT subtask_name, date_completed
        FROM subtasks
        WHERE task_id = :task_id
        ORDER BY subtask_id
    ";

    $stmt = $db->prepare($sql);
    $stmt->bindValue(':task_id', $_GET['taskId']);
    $ret = $stmt->execute();

    $out = [];
    while ($row = $ret->fetchArray(SQLITE3_ASSOC)) {
        $out[] = [
            'name' => $row['subtask_name'],
            'isComplete' => (!empty($row['date_completed'])),
        ];
    }

    exit(json_encode($out));
