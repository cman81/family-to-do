<?php
    require __DIR__ . '/../vendor/autoload.php';
    require_once "AppDB.class.php";
    
    if ($_GET['isChecking'] == '1') {
        $change = [ 'date_completed' => new DateTime() ];
    } else {
        $change = [ 'date_completed' => NULL ];
    }

    DB::update(
        'subtasks',
        $change,
        'subtask_id = %i',
        $_GET['subtaskId']
    );
    
    exit(json_encode($_GET));
