<?php
    require_once "AppDB.class.php";
    $data = file_get_contents("php://input");
    $_POST = json_decode($data, TRUE); // not typical, i know
    
    $db = new AppDB();
    $db->busyTimeout(250);

    updateTask($_POST);
    updateTaskDetail($_POST);

    $out = TRUE;
    exit(json_encode($out));

    function updateTask($changes) {
        $db = $GLOBALS['db'];

        if (!$changes['id']) { return; }
        if (!isset($changes['name']) && !isset($changes['dateDue'])) { return; }

        $setClauses = [];
        if ($changes['name']) {
            $setClauses[] = "task_name = :task_name";
        }
        if ($changes['dateDue']) {
            $setClauses[] = "date_due = :date_due";
        }

        $sql = "
            UPDATE tasks
            SET " . implode(',', $setClauses) . "
            WHERE task_id = :task_id
        ";

        $stmt = $db->prepare($sql);

        // passing values to the parameters
        $stmt->bindValue(':task_id', $changes['id']);
        $stmt->bindValue(':task_name', $changes['name']);
        $stmt->bindValue(':date_due', strtotime($changes['dateDue']));

        $stmt->execute();
    }

    function updateTaskDetail($changes) {
        $db = $GLOBALS['db'];

        if (!$changes['id']) { return; }
        if (!isset($changes['taskNote'])) { return; }

        // @see https://www.sqlite.org/lang_UPSERT.html
        $sql = "
            INSERT INTO task_details
            (task_id, task_note)
            VALUES
            (:task_id, :task_note)
            ON CONFLICT(task_id) DO
            UPDATE
                SET task_note = :task_note;
        ";

        $stmt = $db->prepare($sql);

        // passing values to the parameters
        $stmt->bindValue(':task_id', $changes['id']);
        $stmt->bindValue(':task_note', $changes['taskNote']);

        $stmt->execute();
    }
