<?php
    require __DIR__ . '/../vendor/autoload.php';
    require_once "AppDB.class.php";
    $data = file_get_contents("php://input");
    $_POST = json_decode($data, TRUE); // not typical, i know
    
    updateSubtask($_POST);

    exit(json_encode($_POST));

    function updateSubtask($changes) {
        if (!$changes['id']) { return; }
        if (empty(trim($changes['name']))) { return; }

        DB::query(
            "
                UPDATE subtasks
                SET subtask_name = %s
                WHERE subtask_id = %i
            ",
            $changes['name'],
            $changes['id']
        );
    }
