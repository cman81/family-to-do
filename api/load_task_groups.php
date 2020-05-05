<?php
    require __DIR__ . '/../vendor/autoload.php';
    require_once "AppDB.class.php";

    $results = DB::query(
        "
            SELECT group_id, group_name
            FROM task_groups
            WHERE owner_id = %i
            OR is_public = 1
        ",
        $_GET['ownerId']
    );

    if (empty($results)) { exit(json_encode([])); }

    $out = array_map(
        function($row){
            return [
                'id' => $row['group_id'],
                'name' => $row['group_name'],
            ];
        },
        $results
    );

    exit(json_encode($out));
