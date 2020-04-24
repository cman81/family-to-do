<?php
    require_once "AppDB.class.php";
    
    $db = new AppDB();
    $sql = "
        UPDATE tasks
        SET date_completed = :date_completed
        WHERE task_id = :task_id
    ";
    $stmt = $db->prepare($sql);

    // passing values to the parameters
    $stmt->bindValue(':task_id', $_GET['taskId']);
    $stmt->bindValue(':date_completed', time());

    $ret = $stmt->execute();

    $out = TRUE;

    exit(json_encode($out));
