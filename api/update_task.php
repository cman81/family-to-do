<?php
    require __DIR__ . '/../vendor/autoload.php';
    require_once "AppDB.class.php";
    $data = file_get_contents("php://input");
    $_POST = json_decode($data, TRUE); // not typical, i know
    
    updateTask($_POST);
    updateTaskDetail($_POST);

    exit(json_encode($_POST));

    function updateTask($changes) {
        if (empty(validate_task($changes))) { return; } 

        $set_clauses = [];
        if ($changes['name']) {
            $set_clauses['task_name'] = $changes['name'];
        }
        if ($changes['dateDue']) {
            $set_clauses['date_due'] = new DateTime($changes['dateDue']);
        }
        if ($changes['dateDue'] === '') {
            $set_clauses['date_due'] = NULL;
        }
        if ($changes['respawn']) {
            $set_clauses['respawn'] = $changes['respawn'];
            if ($changes['respawn'] == 'never') {
                $set_clauses['respawn'] = NULL;
            }
        }

        DB::update(
            'tasks',
            $set_clauses,
            'task_id = %i',
            $changes['id']
        );
    }

    function validate_task($changes) {
        if (!$changes['id']) { return FALSE; }
        if ($changes['respawn']) { return TRUE; }
        if (empty(trim($changes['name'])) && !isset($changes['dateDue'])) { return FALSE; }
    }

    function updateTaskDetail($changes) {
        if (!$changes['id']) { return; }
        if (!isset($changes['taskNote'])) { return; }

        DB::replace(
            'task_details',
            [
                'task_id' => $changes['id'],
                'task_note' => $changes['taskNote'],
            ]
        );
    }
