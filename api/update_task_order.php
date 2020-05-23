<?php
    require __DIR__ . '/../vendor/autoload.php';
    require_once "AppDB.class.php";
    $data = file_get_contents("php://input");
    $_POST = json_decode($data, TRUE); // not typical, i know
    
    DB::update(
        'task_groups',
        [
            'task_set_order' => json_encode($_POST['taskOrder']),
        ],
        'group_id = %i',
        $_POST['groupId']
    );

    exit(json_encode($_POST));
