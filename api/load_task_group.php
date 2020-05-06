<?php
    require __DIR__ . '/../vendor/autoload.php';
    require_once "AppDB.class.php";

    $row = DB::queryFirstRow(
        "
            SELECT group_name
            FROM task_groups
            WHERE group_id = %i
        ",
        $_GET['groupId']
    );

    if (empty($row)) { exit(json_encode(FALSE)); }

    exit(json_encode([
        'id' => $_GET['groupId'],
        'name' => $row['group_name'],
    ]));
