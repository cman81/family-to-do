<?php
    require __DIR__ . '/../vendor/autoload.php';
    require_once "AppDB.class.php";
    $data = file_get_contents("php://input");
    $_POST = json_decode($data, TRUE); // not typical, i know

    DB::insert(
        'subtasks',
        [
            'task_id' => $_POST['parentTask'],
            'subtask_name' => $_POST['name'],
        ]
    );

    $out = [
        'id' => DB::insertId(),
        'tempId' => $_POST['tempId'],
    ];

    exit(json_encode($out));
