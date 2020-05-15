<?php
    require __DIR__ . '/../vendor/autoload.php';
    $data = file_get_contents("php://input");
    $_POST = json_decode($data, TRUE); // not typical, i know

    session_start();

    if (empty($_SESSION['breadcrumb'])) { $_SESSION['breadcrumb'] = []; }

    if (empty($_POST)) { exit(json_encode($_SESSION['breadcrumb'])); }

    $key = $_POST['htmlPage'];
    $value = $_POST['params'];
    $_SESSION['breadcrumb'][$key] = $value;

    exit(json_encode($_SESSION['breadcrumb']));
