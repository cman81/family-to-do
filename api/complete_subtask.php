<?php
    require_once "AppDB.class.php";
    
    $db = new AppDB();
    $sql = "
        UPDATE subtasks
        SET date_completed = :date_completed
        WHERE subtask_id = :subtask_id
    ";
    $stmt = $db->prepare($sql);

    // passing values to the parameters
    $stmt->bindValue(':subtask_id', $_GET['subtaskId']);
    if ($_GET['isChecking'] == '1') {
        $stmt->bindValue(':date_completed', time());
    } else {
        $stmt->bindValue(':date_completed', NULL);
    }

    $ret = $stmt->execute();

    exit(json_encode($_GET));
