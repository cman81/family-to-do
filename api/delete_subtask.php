<?php
    require __DIR__ . '/../vendor/autoload.php';
    require_once "AppDB.class.php";

    DB::query("DELETE FROM subtasks WHERE subtask_id = %i", $_GET['subtaskId']);
    
    exit(json_encode($_GET));
