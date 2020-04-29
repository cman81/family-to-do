<?php
require_once __DIR__ . '/../vendor/autoload.php';

// @see https://devcenter.heroku.com/articles/jawsdb#using-jawsdb-with-php
$url = getenv('JAWSDB_URL');
$dbparts = parse_url($url);
$database = ltrim($dbparts['path'],'/');

if (empty($dbparts['host'])) { $dbparts['host'] = 'localhost'; }
if (empty($dbparts['user'])) { $dbparts['user'] = 'user'; }
if (empty($dbparts['pass'])) { $dbparts['pass'] = 'password'; }
if (empty($database)) { $database = 'ftd'; }

DB::$host = $dbparts['host'];
DB::$user = $dbparts['user'];
DB::$password = $dbparts['pass'];
DB::$dbName = $database;
