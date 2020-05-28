<?php
    require __DIR__ . '/../vendor/autoload.php';
    require_once "AppDB.class.php";
    $data = file_get_contents("php://input");
    $_POST = json_decode($data, TRUE); // not typical, i know
    
    update_task($_POST);
    update_task_detail($_POST);

    exit(json_encode($_POST));

    function update_task($changes) {
        if (empty(validate_task($changes))) { return; } 

        $set_clauses = [];
        if ($changes['name']) {
            $set_clauses['task_name'] = $changes['name'];
        }
        if ($changes['dateDue']) {
            if (strlen($changes['dateDue']) > 10) {
                $changes['dateDue'] = substr($changes['dateDue'], 0, 10);
            }
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
        if (isset($changes['category'])) {
            if (empty($changes['category'])) { $changes['category'] = NULL; }
            $set_clauses['category'] = $changes['category'];
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
        if (isset($changes['category'])) { return TRUE; }
        if (empty(trim($changes['name'])) && !isset($changes['dateDue'])) { return FALSE; }
        
        return TRUE;
    }

    function update_task_detail($changes) {
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
