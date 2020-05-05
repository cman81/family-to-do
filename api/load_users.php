<?php
    require __DIR__ . '/../vendor/autoload.php';
    require_once "AppDB.class.php";

    $results = DB::query(
        "
            SELECT user_id, username
            FROM users
        "
    );

    if (empty($results)) { exit(json_encode([])); }

    $out = array_map(
        function($row){
            return [
                'id' => $row['user_id'],
                'name' => $row['username'],
            ];
        },
        $results
    );

    exit(json_encode($out));
