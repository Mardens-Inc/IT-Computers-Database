<?php
// Database configuration
$DB_HOST = "127.0.0.1";
$DB_USER = "drew";
$DB_PASSWORD = "9bc9f6b264724051";
$DB_NAME = "itcomputers";

if (!isset($_ENV["HASH_SALT"]) || $_ENV["HASH_SALT"] == "") {
    // Hash salt
    if (!file_exists($_SERVER["DOCUMENT_ROOT"] . "/hash")) {
        createGuid();
    } else {
        $guid = file_get_contents($_SERVER["DOCUMENT_ROOT"] . "/hash");
        if ($guid == "") {
            unlink($_SERVER["DOCUMENT_ROOT"] . "/hash");
            createGuid();
        } else {
            $_ENV["HASH_SALT"] = $guid;
        }
    }
}

function createGuid()
{
    $guid = getGUID();
    file_put_contents($_SERVER["DOCUMENT_ROOT"] . "/hash", $guid);
    $_ENV["HASH_SALT"] = $guid;
}

function getGUID()
{
    if (function_exists('com_create_guid')) {
        return com_create_guid();
    } else {
        mt_srand((float)microtime() * 10000); //optional for php 4.2.0 and up.
        $charid = strtoupper(md5(uniqid(rand(), true)));
        $uuid =
            substr($charid, 0, 8)
            . substr($charid, 8, 4)
            . substr($charid, 12, 4)
            . substr($charid, 16, 4)
            . substr($charid, 20, 12);
        return $uuid;
    }
}
