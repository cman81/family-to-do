<?php
require_once __DIR__ . '/../vendor/autoload.php';

// @see https://devcenter.heroku.com/articles/jawsdb#using-jawsdb-with-php
$url = getenv('JAWSDB_URL');
$dbparts = parse_url($url);
$database = ltrim($dbparts['path'],'/');

DB::$host = $dbparts['host'] ?? 'localhost';
DB::$user = $dbparts['user'] ?? 'user';
DB::$password = $dbparts['pass'] ?? 'password';
DB::$dbName = $database ?? 'ftd';
