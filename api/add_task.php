<?php
    require_once "AppDB.class.php";
    $data = file_get_contents("php://input");
    $_POST = json_decode($data, TRUE); // not typical, i know
    
    $db = new AppDB();
    $sql = "
        INSERT INTO tasks
        (task_name, date_created)
        VALUES
        (:task_name, :date_created)
    ";

    $stmt = $db->prepare($sql);
    // passing values to the parameters
    $stmt->bindValue(':task_name', $_POST['name']);
    $stmt->bindValue(':date_created', time());

    $ret = $stmt->execute();

    $sql = "SELECT last_insert_rowid() AS id";
    $stmt = $db->prepare($sql);
    $ret = $stmt->execute();

    while ($row = $ret->fetchArray(SQLITE3_ASSOC)) {
        $out = [
            'id' => $row['id'],
            'tempId' => $_POST['tempId'],
        ];
        break;
    }

    exit(json_encode($out));
