<?php
require_once($_SERVER['DOCUMENT_ROOT'] . '/assets/php/inc/ITComputers.inc.php');
header("Content-Type: application/json");

$computers = new ITComputers();

if ($_SERVER["REQUEST_METHOD"] === "GET") {

    // Get specific computer
    if (isset($_GET["id"])) {
        $id = $_GET["id"];
        $computer = $computers->getComputer($id);
        if ($computer) {
            http_response_code(200);
            die(json_encode($computer));
        } else {
            http_response_code(404);
            die(json_encode(array("message" => "Computer not found")));
        }
    }

    // Get computer count
    if (isset($_GET["count"])) {
        http_response_code(200);
        die(json_encode(["count" => $computers->getComputerCount()]));
    }

    // search
    if (isset($_GET["search"])) {
        $search = $_GET["search"];
        $limit = isset($_GET["limit"]) ? $_GET["limit"] : 10;
        $offset = isset($_GET["offset"]) ? $_GET["offset"] : 0;
        $ascending = isset($_GET["ascending"]) ? $_GET["ascending"] : true;
        $computers = $computers->searchComputers($search, $limit, $offset, $ascending);
        if ($computers) {
            http_response_code(200);
            die(json_encode(["computers" => $computers, "count" => count($computers)]));
        } else {
            http_response_code(404);
            die(json_encode(array("message" => "No computers found")));
        }
    }

    // Filter computers
    if (isset($_GET["filter"])) {
        $filter = json_decode($_GET["filter"], true);
        $limit = isset($_GET["limit"]) ? $_GET["limit"] : 10;
        $offset = isset($_GET["offset"]) ? $_GET["offset"] : 0;
        $ascending = isset($_GET["ascending"]) ? $_GET["ascending"] : true;
        $computers = $computers->filterComputers($filter, $limit, $offset, $ascending);
        if ($computers) {
            http_response_code(200);
            die(json_encode(["computers" => $computers, "count" => count($computers)]));
        } else {
            http_response_code(404);
            die(json_encode(array("message" => "No computers found")));
        }
    }

    die(json_encode($computers->getComputers()));
} else if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = Computer::fromJSON(file_get_contents("php://input"));

    if ($data && $data instanceof Computer) {
        $computer = $computers->addComputer($data);
        if ($computer) {
            http_response_code(201);
            die(json_encode($computer));
        } else {
            http_response_code(500);
            die(json_encode(array("message" => "Failed to add computer")));
        }
    } else {
        http_response_code(400);
        die(json_encode(array("message" => "Invalid JSON")));
    }
} else if ($_SERVER["REQUEST_METHOD"] === "PUT") {
    $data = Computer::fromJSON(file_get_contents("php://input"));

    if ($data && $data instanceof Computer) {
        $computer = $computers->updateComputer($data);
        if ($computer) {
            http_response_code(200);
            die(json_encode($computer));
        } else {
            http_response_code(500);
            die(json_encode(array("message" => "Failed to update computer")));
        }
    } else {
        http_response_code(400);
        die(json_encode(array("message" => "Invalid JSON")));
    }
} else if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    if (isset($_GET["id"])) {
        $id = $_GET["id"];
        $computer = $computers->deleteComputer($id);
        if ($computer) {
            http_response_code(200);
            die(json_encode($computer));
        } else {
            http_response_code(500);
            die(json_encode(array("message" => "Failed to delete computer")));
        }
    }
}
http_response_code(400);
die(json_encode(array("message" => "Invalid request")));
