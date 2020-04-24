<?php
    class AppDB extends SQLite3 {
        function __construct() {
            $this->open('../db/ftd.db');
        }
    }
