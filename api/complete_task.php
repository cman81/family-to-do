<?php
    require __DIR__ . '/../vendor/autoload.php';
    require_once "AppDB.class.php";

    DB::query(
        "
            UPDATE tasks
            SET date_completed = %t
            WHERE task_id = %i
        ",
        new DateTime(),
        $_GET['taskId']
    );

    exit(json_encode($_GET));
