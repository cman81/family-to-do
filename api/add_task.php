<?php
    require __DIR__ . '/../vendor/autoload.php';
    require_once "AppDB.class.php";
    $data = file_get_contents("php://input");
    $_POST = json_decode($data, TRUE); // not typical, i know
    
    DB::insert(
        'tasks',
        [
            'task_name' => $_POST['name'],
            'date_created' => new DateTime(),
            'task_group_id' => $_POST['groupId'],
        ]
    );

    $out = [
        'id' => DB::insertId(),
        'tempId' => $_POST['tempId'],
    ];

    exit(json_encode($out));
